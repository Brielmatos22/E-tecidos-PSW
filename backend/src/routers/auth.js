const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { loginSchema, registrationSchema } = require("../validation/schemas");

router.post("/login", validate(loginSchema), login);
router.post("/cadastrar", validate(registrationSchema), register);

module.exports = router;