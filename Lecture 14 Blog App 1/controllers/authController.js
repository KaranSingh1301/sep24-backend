const registerController = (req, res) => {
  console.log("register api");
  return res.send("register api from controller");
};

const loginController = (req, res) => {
  console.log("login api");
  return res.send("login api from controller");
};

module.exports = { registerController, loginController };
