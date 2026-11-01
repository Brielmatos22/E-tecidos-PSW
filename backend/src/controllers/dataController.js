const prisma = require("../config/prisma");
const { obterStatusConexao } = require("../utils/dbHelper");

const collections = {
  produtos: {
    model: prisma.product,
    fields: ["id", "titulo", "resumo", "detalhe", "imagem", "alt", "preco", "custoPorMetro", "fornecedorId"],
  },
  vendas: {
    model: prisma.sale,
    fields: ["id", "data", "cliente", "tipo", "produto", "metros", "status", "pagamento", "valor", "fornecedorId"],
  },
  contasPessoaFisica: {
    model: prisma.accountPhysical,
    fields: ["id", "nome", "cpf", "nascimento", "email", "endereco", "status", "criadoEm"],
  },
  contasPessoaJuridica: {
    model: prisma.accountLegal,
    fields: ["id", "razaoSocial", "cnpj", "email", "localizacao", "descricao", "status", "criadoEm"],
  },
};

function modelFor(collection) {
  const definition = collections[collection];
  if (!definition) {
    const error = new Error("Coleção não encontrada.");
    error.status = 404;
    throw error;
  }
  return definition;
}

function scopeFor(collection, user) {
  return collection === "produtos" || collection === "vendas"
    ? user?.tipo === "juridica" ? { fornecedorId: user.contaId } : {}
    : {};
}

function serialize(record) {
  if (!record) return record;
  return Object.fromEntries(
    Object.entries(record).filter(([field]) => field !== "mongoId")
  );
}

function recordsInScope(collection, req, id) {
  const query = { ...scopeFor(collection, req.user) };
  if (id !== undefined) query.id = id;
  return query;
}

function ensureBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("O corpo da requisição deve ser um objeto JSON.");
    error.status = 400;
    throw error;
  }
  return body;
}

function dataFor(collection, body, includeId = false) {
  const { fields } = modelFor(collection);
  const allowedFields = includeId ? fields : fields.filter((field) => field !== "id");
  return Object.fromEntries(
    Object.entries(ensureBody(body)).filter(([field]) => allowedFields.includes(field))
  );
}

function collectionHandler(collection, action) {
  return async (req, res, next) => {
    try {
      modelFor(collection);
      const query = recordsInScope(collection, req, req.params.id);
      const result = await action(req, query);
      if (result === null) return res.status(404).json({ message: "Registro não encontrado." });
      return res.json(Array.isArray(result) ? result.map(serialize) : serialize(result));
    } catch (error) {
      if (error.status) return res.status(error.status).json({ message: error.message });
      return next(error);
    }
  };
}

const listCollection = (collection) =>
  collectionHandler(collection, (_req, where) =>
    modelFor(collection).model.findMany({ where, orderBy: { id: "asc" } }));

const getRecord = (collection) =>
  collectionHandler(collection, (_req, where) =>
    modelFor(collection).model.findFirst({ where }));

const createRecord = (collection) =>
  collectionHandler(collection, (req) => {
    const data = dataFor(collection, req.body, true);
    if (req.user.tipo === "juridica" && ["produtos", "vendas"].includes(collection)) {
      data.fornecedorId = req.user.contaId;
    }
    return modelFor(collection).model.create({ data });
  });

const replaceRecord = (collection) =>
  collectionHandler(collection, async (req, where) => {
    const data = dataFor(collection, req.body);
    data.id = req.params.id;
    if (req.user.tipo === "juridica" && ["produtos", "vendas"].includes(collection)) {
      data.fornecedorId = req.user.contaId;
    }
    const existing = await modelFor(collection).model.findFirst({ where });
    if (!existing) return null;
    return modelFor(collection).model.update({ where: { id: existing.id }, data });
  });

const updateRecord = (collection) =>
  collectionHandler(collection, async (req, where) => {
    const data = dataFor(collection, req.body);
    if (req.user.tipo === "juridica" && ["produtos", "vendas"].includes(collection)) {
      delete data.fornecedorId;
    }
    const existing = await modelFor(collection).model.findFirst({ where });
    if (!existing) return null;
    return modelFor(collection).model.update({ where: { id: existing.id }, data });
  });

const deleteRecord = (collection) =>
  collectionHandler(collection, async (_req, where) => {
    const model = modelFor(collection).model;
    const existing = await model.findFirst({ where });
    if (!existing) return null;
    return model.delete({ where: { id: existing.id } });
  });

async function getDatabaseStatus(_req, res, next) {
  try {
    return res.json(await obterStatusConexao());
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCollection,
  getRecord,
  createRecord,
  replaceRecord,
  updateRecord,
  deleteRecord,
  getDatabaseStatus,
};
