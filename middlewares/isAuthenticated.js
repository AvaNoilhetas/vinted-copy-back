const User = require("./../models/users");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    }).select("avatar account email _id");

    if (!user) {
      return res.status(401).json({ error: "Non autorisé 🙅" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Non autorisé 🙅" });
  }
};

module.exports = isAuthenticated;
