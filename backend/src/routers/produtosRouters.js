const express = require("express");
const {
  listCollection,
  getRecord,
  createRecord,
  replaceRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/dataController");
const { authenticate, optionalAuthenticate, requirePermission } = require("../middleware/auth");

const router = express.Router();

router.get("/", optionalAuthenticate, listCollection("produtos"));
router.get("/:id", optionalAuthenticate, getRecord("produtos"));

router.use(authenticate, requirePermission("produtos:write"));
router.post("/", createRecord("produtos"));
router.put("/:id", replaceRecord("produtos"));
router.patch("/:id", updateRecord("produtos"));
router.delete("/:id", deleteRecord("produtos"));

module.exports = router;
