const { register } = require("../controllers/register");
const { runValidation } = require("../validators");
const { registerValidator } = require("../validators/auth");

const router = require("express").Router();

router.post("/register", registerValidator, runValidation, register);

module.exports = router;
