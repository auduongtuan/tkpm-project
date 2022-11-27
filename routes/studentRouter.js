const express = require("express");
const router = express.Router();
const studentService = require("../services/studentService");
const classroomService = require("../services/classroomService");
const settingService = require("../services/settingService");
const {getAge} = require("../helpers/common");

router.use((req, res, next) => {
  res.locals.page = "student";
  next();
});

router.get("/list", async (req, res) => {
  const classrooms = await classroomService.getAll();
  const search = req.query.search;
  const students = search ? await studentService.search(search) : await studentService.getAll();
  res.render("students/list", { classrooms, students, search });
});
router.get("/create", async (req, res) => {
  const classrooms = await classroomService.getAll();
  res.render("students/create", { classrooms });
});

router.get("/edit/:id", async (req, res) => {
  const student = await studentService.getById(req.params.id);
  if (student) {
    const classrooms = await classroomService.getAll();
    res.render("students/edit", { student, classrooms });
  } else {
    res.redirect("/students/list");
  }
});

router.post("/edit/:id", async (req, res) => {
  const student = await studentService.getById(req.params.id);
  const classrooms = await classroomService.getAll();
  if (!req.body.classroomId) req.body.classroomId = null;
  const setting = await settingService.getOrCreate();
  const age = getAge(req.body.birthdate);
  const studentData = req.body;
  studentData.id = req.params.id;
  if (student) {
    if (age >= setting.minStudentAge && age <= setting.maxStudentAge) {
      try {
        await student.update(req.body);
        return res.render("students/edit", {
          message: "Cập nhật học sinh thành công!",
          messageType: "success",
          student,
          classrooms,
        });
      } catch (err) {
        res.render("students/edit", {
          message: "Đã có lỗi xảy ra vui lòng thử lại.",
          messageType: "danger",
          student: studentData,
          classrooms,
        });
      }
    } else {
      res.render("students/edit", {
        message: "Độ tuổi của học sinh không phù hợp. Vui lòng thử lại.",
        messageType: "danger",
        student: studentData,
        classrooms,
      });
    }
  } else {
    res.redirect("/students/list");
  }
});

router.post("/create", async (req, res) => {
  let { fullname, gender, birthdate, address, email, classroomId } = req.body;
  const classrooms = await classroomService.getAll();
  if (!classroomId) classroomId = null;
  const setting = await settingService.getOrCreate();
  const age = getAge(birthdate);
  if (age >= setting.minStudentAge && age <= setting.maxStudentAge) {
    const student = await studentService.create({
      fullname,
      gender,
      birthdate,
      address,
      email,
      classroomId,
    });
    if (student) {
      res.render("students/create", {
        message: "Tiếp nhận học sinh thành công!",
        messageType: "success",
        // student,
        classrooms,
      });
    } else {
      res.render("students/create", {
        message: "Đã có lỗi xảy ra vui lòng thử lại.",
        messageType: "danger",
        student: req.body,
        classrooms,
      });
    }
  } else {
    res.render("students/create", {
      message: "Độ tuổi của học sinh không phù hợp. Vui lòng thử lại.",
      messageType: "danger",
      student: req.body,
      classrooms,
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await studentService.delete(req.params.id);
    res.status(200).json({state: true});
  }
  catch(err) {
    res.status(500).json({state: false, message: err.message})
  }
});

module.exports = router;
