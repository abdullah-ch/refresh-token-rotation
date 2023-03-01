const express = require("express");
const cors = require("cors");

const { connect } = require("./config/database");
const authRouter = require("./routers/auth");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// mongodb connection
connect();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
