const express = require("express");
const bcrypt = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const userRouter = require("./routes/userRoutes.routes");
app.use(express.static("public"));
app.set("view engine", "ejs");

//Session and Flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
app.use((req, res) => {
  res.status(401).send("page doesn't exist");
});
module.exports = app;
