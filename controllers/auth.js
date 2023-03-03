const User = require("../model/User");
const {
  hashPassword,
  comparePasswords,
} = require("../helpers/passwordHandler");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await hashPassword(password);
      const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return res.json({ message: "Signup success" });
    } else {
      return res.status(403).json({ error: "User already exists" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const { firstname, lastname, _id } = user;
    const isMatch = await comparePasswords(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      jwt.sign(
        { email, firstname, lastname, id: _id },
        process.env.JWTSECRET,
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: user._id,
            email: user.email,
          });
        }
      );
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

exports.profile = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWTSECRET, {}, async (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

exports.logout = async (req, res) => {
  res.cookie("token", "").json({ loggedout: true });
};
