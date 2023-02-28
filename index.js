const express = require("express");
const { connect } = require("./config/database");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// mongodb connection
connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
