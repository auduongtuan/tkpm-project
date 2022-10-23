const express = require('express');
const router = express.Router();
const studentService = require('../services/studentService');
const classroomService = require('../services/classroomService');

router.get('/list', async (req, res) => {
  const classrooms = await classroomService.getAll();
  const students = await studentService.getAll();
  res.render('students/list', {classrooms, students});
});
router.get('/create', async (req, res) => {
  const classrooms = await classroomService.getAll();
  res.render('students/create', {classrooms});
});

router.get('/edit/:id', async (req, res) => {
  const student = await studentService.getById(req.params.id);
  if (student) {
    const classrooms = await classroomService.getAll();
    res.render('students/edit', {student, classrooms});
  } else {
    res.redirect('/students/list');
  }
});

router.post('/edit/:id', async (req, res) => {
  const student = await studentService.getById(req.params.id);
  const classrooms = await classroomService.getAll();
  if (!req.body.classroomId) req.body.classroomId = null;

  if (student) {
    try {
      await student.update(req.body);
      return res.render('students/edit', {message: 'Cập nhật học sinh thành công!', messageType: 'success', student, classrooms});
    }
    catch(err) {
      console.log(err);
      res.render('students/edit', {message: 'Đã có lỗi xảy ra vui lòng thử lại.', messageType: 'danger', student, classrooms});
    }
  } else {
    res.redirect('/students/list');
  }
});


router.post('/create', async (req, res) => {
  let {fullname, gender, birthdate, address, email, classroomId} = req.body;
  console.log(req.body);
  if (!classroomId) classroomId = null;
  const student = await studentService.create({fullname, gender, birthdate, address, email, classroomId});
  if (student) {
    res.render('students/create', {message: 'Tiếp nhận học sinh thành công!', messageType: 'success'});
  } else {
    res.render('students/create', {message: 'Đã có lỗi xảy ra vui lòng thử lại.', messageType: 'danger', student: req.body});
  }
});


module.exports = router;
