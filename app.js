// app.js

const express = require('express')
const app = express()
const port = 3018

// cookie parser
const cookieParser = require("cookie-parser");

const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route")

// Middleware ==================================================
app.use(express.json()) // req.body parser
app.use(cookieParser()); // cookie parser
// Middleware ==================================================

// localhost:3018/api/
app.use('/api', [usersRouter, postsRouter]);

app.listen(port, () => {
  console.log(port, '=> server open!');
});
