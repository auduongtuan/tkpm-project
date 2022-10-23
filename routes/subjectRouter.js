const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const classroomService = require('../services/classroomService');

router.use((req, res, next) => {
  res.locals.page = "subject";
  next();
});

router.get('/list', async (req, res) => {
  const classrooms = await classroomService.getAll();
  const subjects = await subjectService.getAll();
  res.render('subjects/list', {classrooms, subjects});
});
router.get('/create', async (req, res) => {
  res.render('subjects/create', {});
});

router.post('/create', async (req, res) => {
  const {name} = req.body;
  const subject = await subjectService.create({name});
  if (subject) {
    res.render('subjects/create', {message: 'Tạo môn học thành công!', messageType: 'success'});
  } else {
    res.render('subjects/create', {message: 'Đã có lỗi xảy ra vui lòng thử lại.', messageType: 'danger'});
  }
});

router.get('/edit/:id', async (req, res) => {
  const subject = await subjectService.getById(req.params.id);
  if (subject) {
    res.render('subjects/edit', {subject});
  } else {
    return res.redirect('/subjects/list');
  }
});

router.post('/edit/:id', async (req, res) => {
  const {name} = req.body;
  const subject = await subjectService.getById(req.params.id);
  if (subject) {
    try {
      await subject.update({name});
      return res.render('subjects/edit', {subject, message: 'Chỉnh sửa môn học thành công!', messageType: 'success'});
    }
    catch(err) {
      return res.render('subjects/edit', {subject, message: 'Đã có lỗi xảy ra vui lòng thử lại.', messageType: 'danger'});
    }
  } else {
    return res.redirect('/subjects/list');
  }
});


module.exports = router;
