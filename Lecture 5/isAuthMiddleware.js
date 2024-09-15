const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.send("Session expired, please login again");
  }
};

module.exports = isAuth;
