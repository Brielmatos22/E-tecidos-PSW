require("../config/env");

const fs = require("node:fs/promises");
const path = require("node:path");
const connectDatabase = require("../config/bd");
const prisma = require("../config/prisma");
const logger = require("../config/logger");
const { hashPassword } = require("../utils/HashPassword");
const { seedSchemas } = require("../validation/schemas");

const dataDirectory = path.resolve(__dirname, "../../../frontendd/src/data");
const collections = [
  ["produtosdb.json", prisma.product],
  ["vendasdb.json", prisma.sale],
  ["contasPessoasFisicasdb.json", prisma.accountPhysical],
  ["contasPessoasJuridicasdb.json", prisma.accountLegal],
];

async function seedCollection(filename, model) {
  const contents = await fs.readFile(path.join(dataDirectory, filename), "utf8");
  const records = seedSchemas[filename].parse(JSON.parse(contents));
  for (const record of records) {
    await model.upsert({
      where: { id: record.id },
      create: record,
      update: {},
    });
  }
  logger.info(`Dados iniciais verificados: ${filename}.`);
}

async function seedUsers() {
  const contents = await fs.readFile(path.join(dataDirectory, "usuariosdb.json"), "utf8");
  const users = seedSchemas["usuariosdb.json"].parse(JSON.parse(contents));
  for (const user of users) {
    const { senha, ...publicData } = user;
    await prisma.user.upsert({
      where: { id: publicData.id },
      create: { ...publicData, passwordHash: await hashPassword(senha) },
      update: {},
    });
  }
  logger.info("Usuários de demonstração verificados.");
}

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI não foi configurada.");
  await connectDatabase();

  for (const [filename, Model] of collections) {
    await seedCollection(filename, Model);
  }
  await seedUsers();
  logger.info("Seed concluído.");
}

seed()
  .catch((error) => {
    logger.error(`Falha no seed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
