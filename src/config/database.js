const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URL } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
