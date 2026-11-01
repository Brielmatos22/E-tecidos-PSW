const logger = require("../config/logger");

function errorHandler(error, _req, res, _next) {
  void _next;
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.code === "P2002") {
    return res.status(409).json({ message: "Já existe um registro com esses dados." });
  }
  if (error.code === "P2025") {
    return res.status(404).json({ message: "Registro não encontrado." });
  }
  if (error.code === "P2031") {
    return res.status(503).json({
      message: "O MongoDB precisa estar configurado como replica set para operações transacionais.",
    });
  }
  if (error.code === "P1001" || error.code === "P1002" || error.code === "P1008") {
    return res.status(503).json({ message: "Não foi possível conectar ao banco de dados." });
  }
  if (
    error.name === "PrismaClientValidationError"
    || ["P2000", "P2003", "P2011", "P2012", "P2013", "P2023"].includes(error.code)
  ) {
    return res.status(400).json({ message: "Os dados enviados são inválidos." });
  }

  logger.error(`Erro na API: ${error.code ?? error.name ?? "desconhecido"}`);
  return res.status(500).json({ message: "Ocorreu um erro interno." });
}

module.exports = errorHandler;
