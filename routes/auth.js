const { register, login } = require("../controllers/auth");
const { runValidation } = require("../validators");
const { registerValidator, loginValidator } = require("../validators/auth");

const router = require("express").Router();

router.post("/register", registerValidator, runValidation, register);
router.post("/login", loginValidator, runValidation, login);

module.exports = router;
