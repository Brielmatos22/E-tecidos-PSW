const assert = require("node:assert/strict");
const { test } = require("node:test");
const jwt = require("jsonwebtoken");
const prisma = require("../src/config/prisma");
const { hashPassword, comparePassword } = require("../src/utils/HashPassword");
const { startServer } = require("../test-support/server");

test("registration validates account type before accessing the database", async () => {
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "admin" }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, "Tipo de cadastro inválido.");
});

test("registration rejects invalid e-mail and weak passwords", async () => {
  const baseUrl = await startServer();
  const invalidEmail = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "fisica", email: "inválido", senha: "Senha@123" }),
  });
  assert.equal(invalidEmail.status, 400);
  assert.equal((await invalidEmail.json()).message, "Informe um e-mail válido.");

  const weakPassword = await fetch(`${baseUrl}/api/auth/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo: "fisica", email: "cliente@example.com", senha: "senhafraca" }),
  });
  assert.equal(weakPassword.status, 400);
  assert.match((await weakPassword.json()).message, /letra maiúscula/);
});

test("password hashes verify only the original password", async () => {
  const hash = await hashPassword("SenhaSegura@123");
  assert.notEqual(hash, "SenhaSegura@123");
  assert.equal(await comparePassword("SenhaSegura@123", hash), true);
  assert.equal(await comparePassword("senha-incorreta", hash), false);
  assert.equal(await comparePassword("qualquer", "malformed"), false);
});

test("auth end-to-end registers a legal account, logs in, and creates a scoped product", async () => {
  const baseUrl = await startServer();

  const secret = "end-to-end-test-secret-with-more-than-thirty-two-characters";
  const originalSecret = process.env.JWT_SECRET;
  const originalTransaction = prisma.$transaction;
  const originalFindUser = prisma.user.findUnique;
  const originalFindAccount = prisma.accountLegal.findUnique;
  const originalCreateProduct = prisma.product.create;
  let savedAccount;
  let savedUser;
  let savedProduct;

  process.env.JWT_SECRET = secret;
  prisma.$transaction = async (operation) => operation({
    accountLegal: {
      create: async ({ data }) => {
        savedAccount = data;
        return data;
      },
    },
    user: {
      create: async ({ data }) => {
        savedUser = data;
        return data;
      },
    },
  });
  prisma.user.findUnique = async ({ where }) => {
    if (where.email === savedUser?.email || where.id === savedUser?.id) return savedUser;
    return null;
  };
  prisma.accountLegal.findUnique = async ({ where }) =>
    where.id === savedAccount?.id ? { status: savedAccount.status } : null;
  prisma.product.create = async ({ data }) => {
    savedProduct = data;
    return data;
  };

  const post = (url, body, token) => fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  try {
    const registration = await post("/api/auth/cadastrar", {
      tipo: "juridica",
      email: "  Tecidos@Example.com ",
      senha: "SenhaForte@123",
      razao_social: "  Tecidos Ltda ",
      cnpj: "12.345.678/0001-90",
      localizacao: "São Paulo",
      descricao: "Fornecedor de tecidos",
    });
    assert.equal(registration.status, 201);
    const registered = await registration.json();
    assert.equal(registered.user.email, "tecidos@example.com");
    assert.equal(registered.user.nome, "Tecidos Ltda");
    assert.equal(registered.user.tipo, "juridica");
    assert.deepEqual(registered.user.permissoes, ["vendas:read", "produtos:write"]);
    assert.equal(Object.hasOwn(registered.user, "passwordHash"), false);
    assert.notEqual(savedUser.passwordHash, "SenhaForte@123");
    assert.equal(savedAccount.email, "tecidos@example.com");
    assert.equal(savedAccount.status, "ativa");
    assert.equal(jwt.verify(registered.token, secret).sub, savedUser.id);

    const login = await post("/api/auth/login", {
      email: " TECIDOS@example.com ",
      senha: "SenhaForte@123",
    });
    assert.equal(login.status, 200);
    const authenticated = await login.json();
    assert.equal(authenticated.user.id, registered.user.id);
    assert.equal(jwt.verify(authenticated.token, secret).tipo, "juridica");

    const product = await post("/api/produtos", {
      id: "produto-e2e",
      titulo: "  Tecido de algodão  ",
      resumo: "Tecido macio",
      detalhe: "Descrição do tecido",
      imagem: "https://example.com/algodao.jpg",
      alt: "Tecido de algodão azul",
      preco: 25,
      fornecedorId: "PJ-OUTRO",
    }, authenticated.token);
    assert.equal(product.status, 200);
    assert.equal(savedProduct.titulo, "Tecido de algodão");
    assert.equal(savedProduct.fornecedorId, savedAccount.id);

    const invalidProduct = await post("/api/produtos", {
      id: "produto-e2e-invalido",
      titulo: "Produto inválido",
      resumo: "Resumo",
      detalhe: "Descrição",
      imagem: "https://example.com/tecido.jpg",
      alt: "Tecido",
      preco: -1,
      fornecedorId: savedAccount.id,
    }, authenticated.token);
    assert.equal(invalidProduct.status, 400);
    assert.equal(savedProduct.id, "produto-e2e");
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.user.findUnique = originalFindUser;
    prisma.accountLegal.findUnique = originalFindAccount;
    prisma.product.create = originalCreateProduct;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test("login rejects bad credentials and blocks suspended accounts", async () => {
  const baseUrl = await startServer();

  const secret = "login-test-secret-with-more-than-thirty-two-characters";
  const originalSecret = process.env.JWT_SECRET;
  const originalFindUser = prisma.user.findUnique;
  const originalFindAccount = prisma.accountPhysical.findUnique;
  const passwordHash = await hashPassword("SenhaForte@123");
  const user = {
    id: "USR-LOGIN-TEST",
    nome: "Cliente",
    email: "cliente@example.com",
    passwordHash,
    tipo: "fisica",
    contaId: "PF-LOGIN-TEST",
    permissoes: [],
  };

  process.env.JWT_SECRET = secret;
  prisma.user.findUnique = async ({ where }) =>
    where.email === user.email ? user : null;
  prisma.accountPhysical.findUnique = async () => ({ status: "suspensa" });

  const login = (email, senha) => fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  try {
    const invalidPassword = await login(user.email, "senha-incorreta");
    assert.equal(invalidPassword.status, 401);
    assert.deepEqual(await invalidPassword.json(), { message: "E-mail ou senha inválidos." });

    const unknownUser = await login("inexistente@example.com", "SenhaForte@123");
    assert.equal(unknownUser.status, 401);
    assert.deepEqual(await unknownUser.json(), { message: "E-mail ou senha inválidos." });

    const suspendedAccount = await login(user.email, "SenhaForte@123");
    assert.equal(suspendedAccount.status, 403);
    assert.deepEqual(await suspendedAccount.json(), {
      message: "A conta está suspensa ou indisponível.",
    });

    user.tipo = "desconhecido";
    const invalidRole = await login(user.email, "SenhaForte@123");
    assert.equal(invalidRole.status, 401);
    assert.deepEqual(await invalidRole.json(), { message: "E-mail ou senha inválidos." });
  } finally {
    prisma.user.findUnique = originalFindUser;
    prisma.accountPhysical.findUnique = originalFindAccount;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test("authenticated requests refresh JWTs that are close to expiration", async () => {
  const baseUrl = await startServer();

  const secret = "refresh-test-secret-with-more-than-thirty-two-characters";
  const originalSecret = process.env.JWT_SECRET;
  const originalFindUser = prisma.user.findUnique;
  const originalFindProducts = prisma.product.findMany;
  const user = {
    id: "USR-REFRESH-TEST",
    nome: "Administrador",
    email: "admin@example.com",
    tipo: "admin",
    contaId: null,
    permissoes: ["produtos:write"],
  };
  const almostExpiredToken = jwt.sign(
    { sub: user.id, tipo: user.tipo },
    secret,
    { expiresIn: "30m" }
  );
  const stillValidToken = jwt.sign(
    { sub: user.id, tipo: user.tipo },
    secret,
    { expiresIn: "2h" }
  );

  process.env.JWT_SECRET = secret;
  prisma.user.findUnique = async ({ where }) => where.id === user.id ? user : null;
  prisma.product.findMany = async () => [];

  try {
    const request = (token, scheme = "Bearer") => fetch(`${baseUrl}/api/produtos`, {
      headers: {
        Authorization: `${scheme}  ${token}`,
        Origin: "http://localhost:5173",
      },
    });

    const unchangedResponse = await request(stillValidToken);
    assert.equal(unchangedResponse.status, 200);
    assert.equal(unchangedResponse.headers.get("X-Access-Token"), null);

    const refreshResponse = await request(almostExpiredToken, "bEaReR");
    assert.equal(refreshResponse.status, 200);
    const refreshedToken = refreshResponse.headers.get("X-Access-Token");
    assert.ok(refreshedToken);
    assert.match(refreshResponse.headers.get("Access-Control-Expose-Headers"), /X-Access-Token/i);

    const refreshedPayload = jwt.verify(refreshedToken, secret);
    assert.equal(refreshedPayload.sub, user.id);
    assert.equal(refreshedPayload.tipo, user.tipo);
    assert.ok(refreshedPayload.exp - Math.floor(Date.now() / 1000) > 7 * 60 * 60);
  } finally {
    prisma.user.findUnique = originalFindUser;
    prisma.product.findMany = originalFindProducts;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});

test("authentication rejects expired tokens and signed tokens without an expiration", async () => {
  const baseUrl = await startServer();

  const secret = "expired-test-secret-with-more-than-thirty-two-characters";
  const originalSecret = process.env.JWT_SECRET;
  const originalFindUser = prisma.user.findUnique;
  let databaseLookups = 0;
  const expiredToken = jwt.sign(
    { sub: "USR-EXPIRED-TEST", tipo: "admin" },
    secret,
    { expiresIn: -1 }
  );
  const nonExpiringToken = jwt.sign(
    { sub: "USR-EXPIRED-TEST", tipo: "admin" },
    secret
  );

  process.env.JWT_SECRET = secret;
  prisma.user.findUnique = async () => {
    databaseLookups += 1;
    return null;
  };

  try {
    for (const token of [expiredToken, nonExpiringToken, "not-a-jwt"]) {
      const response = await fetch(`${baseUrl}/api/vendas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.equal(response.status, 401);
    }
    assert.equal(databaseLookups, 0);
  } finally {
    prisma.user.findUnique = originalFindUser;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
