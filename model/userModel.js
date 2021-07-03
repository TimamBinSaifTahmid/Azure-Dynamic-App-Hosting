const user = {
  name: "",
  email: "",
  password: "",
};

const userCreation = (name, email, password) => {
  user.name = name;
  user.email = email;
  user.password = password;
};
module.exports = { user, userCreation };
