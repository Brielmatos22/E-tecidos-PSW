const cors = require("cors");
const express = require("express");
const apiRouter = require("./routers/Api");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./config/logger");

const app = express();

app.disable("x-powered-by");
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : true,
}));
app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});
app.use("/api", apiRouter);
app.use((req, res) => res.status(404).json({ message: "Rota não encontrada." }));
app.use(errorHandler);

module.exports = app;
