const user = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

const userCreation = (name, email, password, phone) => {
  user.name = name;
  user.email = email;
  user.password = password;
  user.phone = phone;
};
module.exports = { user, userCreation };
