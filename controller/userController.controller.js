require("dotenv").config();
let flag = false;
let userName = "";

const getRegister = (req, res) => {
  const knex = require("knex");
  const postgres = knex({
    client: "pg",
    connection: {
      host: "lab02-180042117.postgres.database.azure.com",
      user: "tahmid@lab02-180042117",
      password: "Timambinsaif17",
      database: "postgres",
      SslMode: "Require",
    },
  });
  postgres
    .select("*")
    .from("users")
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("asdsad", req.flash("errors"));

  res.render("userViews/register-v2.ejs", { errors: req.flash("errors") });
};

const postRegister = (req, res) => {
  const { user, userCreation } = require("./../model/userModel");
  const { name, email, password, retypedPassword, phone } = req.body;
  //Data Validation
  // console.log(name, email, password, retypedPassword);
  const errors = [];
  if (!name || !email || !password || !retypedPassword) {
    errors.push("All fields are required!");
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters!");
  }
  if (password !== retypedPassword) {
    errors.push("Passwords do not match!");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    res.redirect("/register");
  } else {
    console.log(name, email, password, phone);
    userCreation(name, email, password, phone);
    console.log(user.phone);
    const bcrypt = require("bcrypt-nodejs");
    const knex = require("knex");
    const postgres = knex({
      client: process.env.client,
      connection: {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
      },
      error(message) {
        console.log(message);
      },
    });
    console.log("connect successful");
    console.log(process.env.host);
    const hash = bcrypt.hashSync(password);
    console.log(user.name, user.email, hash);
    postgres("users")
      .insert({
        name: user.name,
        email: user.email,
        password: hash,
      })
      .then(() => {
        console.log("success");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log("dsfsdf", err);
        errors.push(err.detail);
        console.log(err.detail);
        req.flash("errors", errors);
        res.redirect("/register");
      });
    console.log("asdasd");
  }
};

const getLogin = (req, res) => {
  res.render("userViews/login-v2.ejs", { error: req.flash("error") });
};

const postLogin = (req, res) => {
  const { email, password } = req.body;
  const { user, userCreation } = require("./../model/userModel");
  const bcrypt = require("bcrypt-nodejs");
  const knex = require("knex");
  const postgres = knex({
    client: process.env.client,
    connection: {
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
    },
  });

  postgres
    .select("name", "email", "password")
    .from("users")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
        userCreation(data[0].name, data[0].email, data[0].password, user.phone);
        userName = data[0].name;
        console.log(userName);
        const alert = require("alert");
        alert(userName);
        res.redirect("/dashboard");
        flag = true;
      } else {
        error = "Wrong credential";
        req.flash("error", error);
        res.redirect("/login");
        res.status(400).json("wrong credential");
      }
    })
    .catch((err) => {
      error = "Wrong credential";
      req.flash("error", error);
      res.redirect("/login");
      res.status(400).json("wrong credential");
    });
};
const islogin = () => {
  return flag;
};
const getname = () => {
  return userName;
};
const getDashboard = (req, res) => {
  const { user, userCreation } = require("./../model/userModel");
  console.log(user.phone);
  res.render("index.ejs", { user: user });
  flag = false;
};
module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getDashboard,
  islogin,
};
