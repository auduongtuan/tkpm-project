const service = {};
const {User} = require("../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { Op } = require("sequelize");

service.login = async (username, password, remember, req) => {
  const user = await User.findOne({
    where: {
      username: username
    }
  });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      if (remember) {
        req.session.cookie.maxAge = 31536000;
      }
      req.session.user = user;
      return user;
    } else {
      return false;
    }
  } else {
    return null;
  }
}
service.create = async (username, password, fullname) => {
  return await User.findOrCreate({
    where: {
      username: username,
    },
    defaults: {
      fullname: fullname,
      password: bcrypt.hashSync(password, saltRounds)
    }
  });
}


module.exports = service;
