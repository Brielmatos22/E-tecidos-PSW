import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = join(projectRoot, "src", "data");
const databasePath = join(projectRoot, "server", "db.json");
const collections = {
  produtos: "produtosdb.json",
  vendas: "vendasdb.json",
  contasPessoaFisica: "contasPessoasFisicasdb.json",
  contasPessoaJuridica: "contasPessoasJuridicasdb.json",
  usuarios: "usuariosdb.json",
};

const database = Object.fromEntries(
  Object.entries(collections).map(([collection, fileName]) => [
    collection,
    JSON.parse(readFileSync(join(dataDirectory, fileName), "utf8")),
  ])
);

mkdirSync(dirname(databasePath), { recursive: true });
writeFileSync(databasePath, `${JSON.stringify(database, null, 2)}\n`);