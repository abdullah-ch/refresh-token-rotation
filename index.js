const express = require("express");
const cors = require("cors");

const { connect } = require("./src/config/database");
const authRouter = require("./src/routers/auth");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routers/user");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// mongodb connection
connect();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
