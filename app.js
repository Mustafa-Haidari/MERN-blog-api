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
const resigterRoute = require("./routes/register");

// app middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// middleware routes
app.use("/api", resigterRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
