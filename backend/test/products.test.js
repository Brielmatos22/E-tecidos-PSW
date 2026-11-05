const assert = require("node:assert/strict");
const { test } = require("node:test");
const jwt = require("jsonwebtoken");
const prisma = require("../src/config/prisma");
const { startServer } = require("../test-support/server");

test("product write routes persist only validated Zod data", async () => {
  const baseUrl = await startServer();

  const secret = "test-secret-with-more-than-thirty-two-characters";
  const originalSecret = process.env.JWT_SECRET;
  const originalFindUser = prisma.user.findUnique;
  const originalCreateProduct = prisma.product.create;
  const originalFindProduct = prisma.product.findFirst;
  const originalUpdateProduct = prisma.product.update;
  const saved = [];
  const token = jwt.sign({ sub: "USR-TEST", tipo: "admin" }, secret, { expiresIn: "8h" });

  process.env.JWT_SECRET = secret;
  prisma.user.findUnique = async () => ({
    id: "USR-TEST",
    nome: "Administrador",
    email: "admin@example.com",
    tipo: "admin",
    contaId: null,
    permissoes: ["produtos:write"],
  });
  prisma.product.create = async ({ data }) => {
    saved.push(data);
    return data;
  };
  prisma.product.findFirst = async ({ where }) => ({ id: where.id });
  prisma.product.update = async ({ data }) => {
    saved.push(data);
    return data;
  };

  const request = (url, method, body) => fetch(`${baseUrl}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  try {
    const invalid = await request("/api/produtos", "POST", {
      id: "produto-invalido",
      titulo: "Produto inválido",
      resumo: "Resumo",
      detalhe: "Descrição",
      imagem: "https://example.com/image.jpg",
      alt: "Imagem",
      preco: -10,
      fornecedorId: "PJ-001",
    });
    assert.equal(invalid.status, 400);
    assert.equal(saved.length, 0);

    const created = await request("/api/produtos", "POST", {
      id: "produto-teste",
      titulo: "  Produto teste  ",
      resumo: "Resumo",
      detalhe: "Descrição",
      imagem: "https://example.com/image.jpg",
      alt: "Imagem",
      preco: 10,
      fornecedorId: "PJ-001",
      unexpected: "campo não permitido",
    });
    assert.equal(created.status, 200);
    assert.equal(saved[0].titulo, "Produto teste");
    assert.equal(Object.hasOwn(saved[0], "unexpected"), false);

    const replaced = await request("/api/produtos/produto-teste", "PUT", {
      titulo: "Produto substituído",
      resumo: "Resumo",
      detalhe: "Descrição",
      imagem: "https://example.com/image.jpg",
      alt: "Imagem",
      preco: 12,
      fornecedorId: "PJ-001",
      unexpected: "campo não permitido",
    });
    assert.equal(replaced.status, 200);
    assert.equal(saved[1].id, "produto-teste");
    assert.equal(Object.hasOwn(saved[1], "unexpected"), false);

    const updated = await request("/api/produtos/produto-teste", "PATCH", {
      titulo: "  Título atualizado  ",
      unexpected: "campo não permitido",
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(saved[2], { titulo: "Título atualizado" });
  } finally {
    prisma.user.findUnique = originalFindUser;
    prisma.product.create = originalCreateProduct;
    prisma.product.findFirst = originalFindProduct;
    prisma.product.update = originalUpdateProduct;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});
