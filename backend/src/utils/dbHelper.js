const prisma = require("../config/prisma");
const logger = require("../config/logger");

async function obterStatusConexao() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    return { conectado: true, status: "conectado" };
  } catch (error) {
    logger.warn(`Prisma MongoDB indisponível: ${error.code ?? error.name}`);
    return { conectado: false, status: "desconectado" };
  }
}

module.exports = { obterStatusConexao };
