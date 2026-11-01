const prisma = require("./prisma");
const logger = require("./logger");

async function connectDatabase() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.startsWith("mongodb")) {
    throw new Error("MONGODB_URI precisa ser uma URI MongoDB válida.");
  }

  await prisma.$connect();
  await prisma.$runCommandRaw({ ping: 1 });
  logger.info("Prisma conectado ao MongoDB.");
}

module.exports = connectDatabase;