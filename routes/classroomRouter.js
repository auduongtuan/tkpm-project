const express = require('express');
const router = express.Router();
const classroomSerivce = require('../services/classroomService');

router.get('/list', async (req, res) => {
  const classrooms = await classroomSerivce.getAllWithStudents();
  console.log(classrooms);
  res.render('classrooms/list', {classrooms});
});
router.get('/create', async (req, res) => {
    res.render('classrooms/create');
});
router.get('/assign/:id', async (req, res) => {
  const classroom = await classroomSerivce.getById(req.params.id);
  const students = await studentService.getAll();
  res.render('classrooms/assign', {classroom, students});
});

router.post('/create', async (req, res) => {
  const {name, year, grade} = req.body;
  console.log(req.body);
  const student = await classroomSerivce.create({name, year, grade});
  if (student) {
    res.render('classrooms/create', {message: 'Created!'});
  } else {
    res.render('classrooms/create', {message: 'Error!'});
  }
});


module.exports = router;
