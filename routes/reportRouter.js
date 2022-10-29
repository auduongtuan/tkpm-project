const express = require("express");
const router = express.Router();
const models = require("../models");
const subjectService = require("../services/subjectService");
const classroomService = require("../services/classroomService");
const scoreService = require("../services/scoreService");
const settingService = require("../services/settingService");

router.use((req, res, next) => {
  next();
});

router.get("/subject", async (req, res) => {
  res.locals.page = "report-subject";
  const { semester, year, subjectId } = req.query;
  let classrooms;
  if (
    !semester ||
    !year ||
    !subjectId ||
    isNaN(semester) ||
    isNaN(year) ||
    isNaN(subjectId)
  ) {
    classrooms = null;
  } else {
    classrooms = await classroomService.getAllWithPassedQuantityBySubject(
      year,
      semester,
      subjectId
    );
  }
  const years = await classroomService.getYears();
  const subjects = await subjectService.getAll();
  res.render("reports/subject", { classrooms, subjects, semester, subjectId, years, year });
});

router.get("/semester", async (req, res) => {
  res.locals.page = "report-semester";
  const { semester, year } = req.query;
  let classrooms;
  if (!semester || !year || isNaN(semester) || isNaN(year)) {
    classrooms = null;
  } else {
    classrooms = await classroomService.getAllWithPassedQuantityBySemester(
      year,
      semester
    );
  }
  const years = await classroomService.getYears();
  res.render("reports/semester", { classrooms, semester, years, year });
});

module.exports = router;
