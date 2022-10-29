const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const classroomService = require('../services/classroomService');
const {User} = require("../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
router.get('/login', async (req, res) => {
  req.session.returnURL = req.query.returnURL;
  return res.render('users/login', {layout:'no-login.hbs'});
});
router.post('/login', async (req, res) => {
  const {username, password, remember} = req.body;
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
      if (req.session.returnURL) {
        res.redirect(req.session.returnURL);
      } else {
        res.redirect("/");
      }
    } else {
      res.render('users/login', {layout:'no-login.hbs', message: 'Tên đăng nhập hoặc mật khẩu không đúng!'});
    }
  } else {
    res.render('users/login', {layout:'no-login.hbs', message: 'Tài khoản không tồn tại!'});
  }
});
router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    return res.redirect('/users/login');
  })
});
router.get('/create', async (req, res) => {
  const user = await User.findOrCreate({
    where: {
      username: 'admin'
    },
    defaults: {
      fullname: 'Admin',
      password: bcrypt.hashSync('123456', saltRounds)
    }
  });
  if (user) {
    res.end('created successfully');
  }
});

module.exports = router;
