const express = require('express');
const cors = require('cors');

const { connectDB } = require('./src/config/database');
const authRouter = require('./src/routers/auth');
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routers/user');
const songRouter = require('./src/routers/song');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/song', songRouter);

//Connect to the database before listening
connectDB().then(() => {
  app.listen(port, () => {
    console.log('listening for requests');
  });
});
