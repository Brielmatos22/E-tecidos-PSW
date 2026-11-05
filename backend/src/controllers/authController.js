const { randomBytes } = require("node:crypto");
const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/HashPassword");
const { createToken } = require("../utils/authToken");

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

async function login(req, res, next) {
  try {
    const { email, senha: password } = req.validatedBody;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    if (!["admin", "fisica", "juridica"].includes(user.tipo)) {
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

async function register(req, res, next) {
  try {
    const body = req.validatedBody;
    const type = body.tipo;
    const email = body.email;
    const password = body.senha;

    const accountId = `${type === "fisica" ? "PF" : "PJ"}-${randomBytes(5).toString("hex").toUpperCase()}`;
    const userId = `USR-${randomBytes(5).toString("hex").toUpperCase()}`;
    const date = new Date().toISOString().slice(0, 10);
    const accountData = type === "fisica"
      ? {
          id: accountId,
          nome: body.nome.trim(),
          cpf: body.cpf.trim(),
          nascimento: (body.nascimento || body.data_nascimento).trim(),
          email,
          endereco: body.endereco.trim(),
          status: "ativa",
          criadoEm: date,
        }
      : {
          id: accountId,
          razaoSocial: (body.razaoSocial || body.razao_social).trim(),
          cnpj: body.cnpj.trim(),
          email,
          localizacao: body.localizacao.trim(),
          descricao: body.descricao.trim(),
          status: "ativa",
          criadoEm: date,
        };

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
