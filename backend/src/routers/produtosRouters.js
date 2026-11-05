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
const validate = require("../middleware/validate");
const { collectionSchemasByName } = require("../validation/schemas");

const router = express.Router();
const schemas = collectionSchemasByName.produtos;

router.get("/", optionalAuthenticate, listCollection("produtos"));
router.get("/:id", optionalAuthenticate, getRecord("produtos"));

router.use(authenticate, requirePermission("produtos:write"));
router.post("/", validate(schemas.create), createRecord("produtos"));
router.put("/:id", validate(schemas.replace), replaceRecord("produtos"));
router.patch("/:id", validate(schemas.update), updateRecord("produtos"));
router.delete("/:id", deleteRecord("produtos"));

module.exports = router;
