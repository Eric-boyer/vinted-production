const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user; // stockage pour pouvoir réutuliser user plus tard
      return next();
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
