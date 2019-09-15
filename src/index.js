const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Adding routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Defining server port
const port = process.env.PORT;

// Defining the express app
const app = express();

app.use(express.json());

// Using routers
app.use(userRouter);
app.use(taskRouter);

// Listening to server
app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
