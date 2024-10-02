const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const userSchema = require("../schemas/userSchema");
const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  //data validation
  //check if email and username exist or not (operators)
  //hashed the password
  //store the data in db
  console.log(req.body);
  const { name, email, username, password } = req.body;

  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Data",
      error: error,
    });
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const userObj = new User({ name, email, username, password: hashedPassword });
  try {
    const userDb = await userObj.registerUser();
    return res.send({
      status: 201,
      message: "Register successfully",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  //find the user
  //compare the password

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });

  try {
    const userDb = await User.findUserWithKey({ key: loginId });

    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Incorrect password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };

    return res.send({
      status: 200,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout unsuccessfull",
      });

    return res.send({
      status: 200,
      message: "Logout successfull",
    });
  });
};

module.exports = { registerController, loginController, logoutController };
