const express = require("express");
const authRouter = require("./auth");
const produtosRouter = require("./produtosRouters");
const { authenticate, requirePermission } = require("../middleware/auth");
const {
  listCollection,
  getRecord,
  createRecord,
  replaceRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/dataController");
const { getDatabaseStatus } = require("../controllers/dataController");

const router = express.Router();
const resources = {
  vendas: "vendas:read",
  contasPessoaFisica: "contas:manage",
  contasPessoaJuridica: "contas:manage",
};

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.get("/database", getDatabaseStatus);
router.use("/auth", authRouter);
router.use("/produtos", produtosRouter);

for (const [collection, permission] of Object.entries(resources)) {
  const route = express.Router();
  route.use(authenticate, requirePermission(permission));
  route.get("/", listCollection(collection));
  route.get("/:id", getRecord(collection));
  const writePermission = collection === "vendas" ? "vendas:write" : permission;
  route.post("/", requirePermission(writePermission), createRecord(collection));
  route.put("/:id", requirePermission(writePermission), replaceRecord(collection));
  route.patch("/:id", requirePermission(writePermission), updateRecord(collection));
  route.delete("/:id", requirePermission(writePermission), deleteRecord(collection));
  router.use(`/${collection}`, route);
}

module.exports = router;
