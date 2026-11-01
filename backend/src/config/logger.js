const winston = require("winston");
const fs = require("node:fs");
const path = require("node:path");

const logDirectory = path.resolve(__dirname, "../../logs");
fs.mkdirSync(logDirectory, { recursive: true });

const lineFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) =>
    `${timestamp} [${level.toUpperCase()}]: ${stack ?? message}`
  )
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: lineFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;