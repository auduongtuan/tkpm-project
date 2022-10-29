const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/login', async (req, res) => {
  req.session.returnURL = req.query.returnURL;
  return res.render('users/login', {layout:'basic'});
});
router.post('/login', async (req, res) => {
  const {username, password, remember} = req.body;
  const user = await userService.login(username, password, remember, req);
  if (user != null) {
    if (user) {
      if (req.session.returnURL) {
        res.redirect(req.session.returnURL);
      } else {
        res.redirect("/");
      }
    } else {
      res.render('users/login', {layout:'basic', message: 'Tên đăng nhập hoặc mật khẩu không đúng!'});
    }
  } else {
    res.render('users/login', {layout:'basic', message: 'Tài khoản không tồn tại!'});
  }
});
router.get('/logout', async (req, res) => {
  return req.session.destroy(() => {
    return res.redirect('/users/login');
  })
});
router.get('/create', async (req, res) => {
  const user = await userService.create('admin', '123456');
  if (user) {
    res.redirect("/");
  }
});

module.exports = router;
