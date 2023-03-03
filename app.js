const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectionDB = require("./db");
require("dotenv").config();

// MongoDB config
connectionDB();

// import routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

// app middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use("/uploads", express.static(__dirname + "/uploads"));

// middleware routes
app.use("/api", authRoutes);
app.use("/api", postRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
