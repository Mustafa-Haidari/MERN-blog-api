const { register, login, profile, logout } = require("../controllers/auth");
const { runValidation } = require("../validators");
const { registerValidator, loginValidator } = require("../validators/auth");

const router = require("express").Router();

router.post("/register", registerValidator, runValidation, register);
router.post("/login", loginValidator, runValidation, login);
router.get("/profile", profile);
router.get("/logout", logout);

module.exports = router;
