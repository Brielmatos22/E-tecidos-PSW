const { randomBytes } = require("node:crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/HashPassword");

const accountsByType = {
  fisica: prisma.accountPhysical,
  juridica: prisma.accountLegal,
};

const permissionsByRole = {
  admin: ["vendas:read", "vendas:write", "produtos:write", "contas:manage"],
  juridica: ["vendas:read", "produtos:write"],
  fisica: [],
};

function publicUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    tipo: user.tipo,
    contaId: user.contaId,
    permissoes: user.permissoes,
  };
}

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return jwt.sign({ sub: user.id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

async function login(req, res, next) {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body?.senha;
    if (!email || typeof password !== "string") {
      return res.status(400).json({ message: "Informe e-mail e senha." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    if (user.tipo !== "admin") {
      const account = await accountsByType[user.tipo].findUnique({
        where: { id: user.contaId },
        select: { status: true },
      });
      if (!account || account.status !== "ativa") {
        return res.status(403).json({ message: "A conta está suspensa ou indisponível." });
      }
    }

    const responseUser = publicUser(user);
    return res.json({ token: createToken(user), user: responseUser });
  } catch (error) {
    return next(error);
  }
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    const error = new Error(`O campo ${field} é obrigatório.`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

async function register(req, res, next) {
  try {
    const body = req.body ?? {};
    const type = body.tipo;
    if (!["fisica", "juridica"].includes(type)) {
      return res.status(400).json({ message: "Tipo de cadastro inválido." });
    }

    const email = requiredText(body.email, "e-mail").toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Informe um e-mail válido." });
    }
    const password = body.senha;
    if (typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ message: "O campo senha é obrigatório." });
    }
    if (password.length > 128 || !/(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/.test(password)) {
      return res.status(400).json({
        message: "Use 8 ou mais caracteres, uma letra maiúscula e um caractere especial.",
      });
    }

    const accountId = `${type === "fisica" ? "PF" : "PJ"}-${randomBytes(5).toString("hex").toUpperCase()}`;
    const userId = `USR-${randomBytes(5).toString("hex").toUpperCase()}`;
    const date = new Date().toISOString().slice(0, 10);
    const accountData = type === "fisica"
      ? {
          id: accountId,
          nome: requiredText(body.nome, "nome"),
          cpf: requiredText(body.cpf, "CPF"),
          nascimento: requiredText(body.nascimento ?? body.data_nascimento, "data de nascimento"),
          email,
          endereco: requiredText(body.endereco, "endereço"),
          status: "ativa",
          criadoEm: date,
        }
      : {
          id: accountId,
          razaoSocial: requiredText(body.razaoSocial ?? body.razao_social, "nome da empresa"),
          cnpj: requiredText(body.cnpj, "CNPJ"),
          email,
          localizacao: requiredText(body.localizacao, "localização"),
          descricao: requiredText(body.descricao, "descrição"),
          status: "ativa",
          criadoEm: date,
        };

    const document = type === "fisica" ? accountData.cpf : accountData.cnpj;
    if (type === "fisica" && !/^\d{11}$/.test(document.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Informe um CPF com 11 dígitos." });
    }
    if (type === "juridica" && !/^\d{14}$/.test(document.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Informe um CNPJ com 14 dígitos." });
    }

    const userData = {
      id: userId,
      nome: type === "fisica" ? accountData.nome : accountData.razaoSocial,
      email,
      passwordHash: await hashPassword(password),
      tipo: type,
      contaId: accountId,
      permissoes: permissionsByRole[type],
    };
    const user = await prisma.$transaction(async (transaction) => {
      await (type === "fisica" ? transaction.accountPhysical : transaction.accountLegal)
        .create({ data: accountData });
      return transaction.user.create({ data: userData });
    });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    return next(error);
  }
}

module.exports = { login, register };
