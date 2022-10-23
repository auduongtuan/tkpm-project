const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const classroomService = require('../services/classroomService');

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
    res.render('subjects/create', {message: 'Created!'});
  } else {
    res.render('subjects/create', {message: 'Error!'});
  }
});


module.exports = router;
