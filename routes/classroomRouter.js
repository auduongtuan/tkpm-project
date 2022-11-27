const express = require("express");
const router = express.Router();
const classroomSerivce = require("../services/classroomService");
const studentService = require("../services/studentService");
const settingService = require("../services/settingService");

router.use((req, res, next) => {
  res.locals.page = "classroom";
  next();
});

router.get("/list", async (req, res) => {
  const classrooms = await classroomSerivce.getAllWithStudents();
  res.render("classrooms/list", { classrooms });
});
router.get("/create", async (req, res) => {
  res.render("classrooms/create");
});

router.post("/create", async (req, res) => {
  const { name, year, grade } = req.body;
  const student = await classroomSerivce.create({ name, year, grade });
  if (student) {
    res.render("classrooms/create", {
      message: "Tạo lớp học thành công!",
      messageType: "success",
    });
  } else {
    res.render("classrooms/create", {
      message: "Đã có lỗi xảy ra vui lòng thử lại.",
      messageType: "danger",
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  const classroom = await classroomSerivce.getById(req.params.id);
  // console.log(classroom);
  if (classroom) {
    return res.render("classrooms/edit", { classroom });
  } else {
    return res.redirect("/classrooms/list");
  }
});

router.post("/edit/:id", async (req, res) => {
  const { name } = req.body;
  const classroom = await classroomSerivce.getById(req.params.id);
  if (classroom) {
    try {
      await classroom.update({ name });
      return res.render("classrooms/edit", {
        classroom,
        message: "Chỉnh sửa lớp học thành công!",
        messageType: "success",
      });
    } catch (err) {
      return res.render("classrooms/edit", {
        classroom,
        message: "Đã có lỗi xảy ra vui lòng thử lại.",
        messageType: "danger",
      });
    }
  } else {
    return res.redirect("/classrooms/list");
  }
});

router.get("/assign/:id", async (req, res) => {
  const classroom = await classroomSerivce.getById(req.params.id);
  const students = await studentService.getAllOrderedByClassroom();
  const studentIds = classroom.students.map((student) => student.id);
  res.render("classrooms/assign", {
    classroom,
    students,
    studentIds: JSON.stringify(studentIds),
  });
});

router.post("/assign/:id", async (req, res) => {
  const classroom = await classroomSerivce.getById(req.params.id);
  let students = await studentService.getAllOrderedByClassroom();
  const studentIds = JSON.parse(req.body.studentIds);
  const setting = await settingService.getOrCreate();
  if (classroom && setting) {
    // if (studentIds.length <= settingService.getAll()) {
    console.log(studentIds);
    if (studentIds.length <= setting.maxStudentQuantity) {
      try {
        await studentService.updateClassroomIds(classroom.id, studentIds);
        students = await studentService.getAllOrderedByClassroom();
        return res.render("classrooms/assign", {
          classroom,
          students,
          studentIds: JSON.stringify(studentIds),
          message: "Chỉnh sửa danh sách lớp học thành công!",
          messageType: "success",
        });
      } catch (err) {
        console.log(err);
        return res.render("classrooms/assign", {
          classroom,
          students,
          studentIds: JSON.stringify(studentIds),
          message: "Đã có lỗi xảy ra vui lòng thử lại.",
          messageType: "danger",
        });
      }
    } else {
      return res.render("classrooms/assign", {
        classroom,
        students,
        studentIds: JSON.stringify(studentIds),
        message:
          "Cập nhật thất bại do số lượng học sinh vượt quá số lượng tối đa trong một lớp. Vui lòng thử lại.",
        messageType: "danger",
      });
    }
  }
  // res.render('classrooms/assign', {classroom, students, studentIds: JSON.stringify(studentIds)});
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await classroomSerivce.delete(req.params.id);
    res.status(200).json({ state: true });
  } catch (err) {
    res.status(500).json({ state: false, message: err.message });
  }
});

module.exports = router;
