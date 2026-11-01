require("./config/env");

const app = require("./app");
const logger = require("./config/logger");
const connectDatabase = require("./config/bd");
const prisma = require("./config/prisma");

const port = Number(process.env.PORT ?? 3000);

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT precisa ser uma porta válida.");
  }

  await connectDatabase();
  const server = app.listen(port, () => logger.info(`API iniciada na porta ${port}.`));

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  }
}

startServer().catch((error) => {
  logger.error(`Falha ao iniciar a API: ${error.message}`);
  process.exitCode = 1;
});