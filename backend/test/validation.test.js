const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { collectionSchemasByName, registrationSchema, seedSchemas } = require("../src/validation/schemas");

test("registration schema validates required profile fields and normalizes e-mail", () => {
  const result = registrationSchema.safeParse({
    tipo: "fisica",
    email: "  cliente@example.com ",
    senha: "SenhaSegura@123",
    nome: "Cliente",
    cpf: "123.456.789-00",
    nascimento: "1990-04-12",
    endereco: "Rua de teste",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, "cliente@example.com");
  assert.equal(registrationSchema.safeParse({
    tipo: "fisica",
    email: "cliente@example.com",
    senha: "SenhaSegura@123",
  }).success, false);
});

test("collection schemas reject invalid product and sale values", () => {
  const validProduct = {
    id: "tecido-teste",
    titulo: "Tecido teste",
    resumo: "Resumo",
    detalhe: "Descrição completa",
    imagem: "https://example.com/tecido.jpg",
    alt: "Tecido azul",
    preco: 25,
    custoPorMetro: 10,
    fornecedorId: "PJ-001",
  };
  assert.equal(collectionSchemasByName.produtos.create.safeParse(validProduct).success, true);
  assert.equal(collectionSchemasByName.produtos.create.safeParse({ ...validProduct, preco: -1 }).success, false);
  assert.equal(collectionSchemasByName.vendas.create.safeParse({
    id: "V-1",
    data: "2026-02-30",
    cliente: "Cliente teste",
    tipo: "fisica",
    produto: "tecido-teste",
    metros: 2,
    status: "Invalido",
    pagamento: "Pix",
    valor: 50,
    fornecedorId: "PJ-001",
  }).success, false);
});

test("all checked-in seed files satisfy their Zod schemas", () => {
  const dataDirectory = path.resolve(__dirname, "../../frontendd/src/data");

  for (const [filename, schema] of Object.entries(seedSchemas)) {
    const data = JSON.parse(fs.readFileSync(path.join(dataDirectory, filename), "utf8"));
    assert.equal(schema.safeParse(data).success, true, `${filename} should be valid`);
  }
});
