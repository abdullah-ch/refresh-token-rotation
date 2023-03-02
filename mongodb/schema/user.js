const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let user = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the name of the user"],
      max: [50, "name should be less than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email of user"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password of a user"],
    },
    refreshToken: [],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = user;
