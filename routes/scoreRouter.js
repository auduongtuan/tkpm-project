const express = require("express");
const router = express.Router();
const scoreService = require("../services/scoreService");
const subjectService = require("../services/subjectService");
const studentService = require("../services/studentService");
const classroomService = require("../services/classroomService");

router.use((req, res, next) => {
  res.locals.page = "score";
  next();
});

router.get("/", async (req, res) => {
  const students = await studentService.getAll();
  const classrooms = await classroomService.getAllWithStudents();
  const subjects = await subjectService.getAll();
  const { classroomId, subjectId, semester, status } = req.query;
  let message = null;
  let messageType = null;
  if (status == '1') {
    message = "Cập nhật bảng điểm thành công!";
    messageType = "success";
  } else if (status == '0') {
    message = "Đã có lỗi xảy ra vui lòng thử lại.";
    messageType = "danger";
  }
  if (classroomId && subjectId) {
    const classroom = await classroomService.getById(classroomId);
    const subject = await subjectService.getById(subjectId);
    if (classroom && subject) {
      const scoreData = await scoreService.getScoreDataByCourse(
        classroomId,
        subjectId,
        semester
      );
      return res.render("scores", {
        students,
        classrooms,
        subjects,
        classroom,
        subject,
        semester,
        scoreData,
        message,
        messageType
      });
    }
  } else {
    return res.render("scores", { students, classrooms, subjects });
  }
});

router.post("/update", async (req, res) => {
  const { classroomId, subjectId, semester } = req.body;
  console.log(req.body.scoreData);
  const scoreData = JSON.parse(req.body.scoreData);

  try {
    await scoreService.updateScoresByCourse(
      classroomId,
      subjectId,
      semester,
      scoreData
    );
    return res.redirect(
      `/scores?classroomId=${classroomId}&subjectId=${subjectId}&semester=${semester}&status=1`
    );
  } catch (err) {
    console.log(err);
    return res.redirect(
      `/scores?classroomId=${classroomId}&subjectId=${subjectId}&semester=${semester}&status=0`
    );
  }
  
});

// router.post("/", async (req, res) => {
//   const setting = await settingService.getOrCreate();
//   const { minStudentAge, maxStudentAge, maxStudentQuantity, passScore } =
//     req.body;
//   if (setting && !isNaN(minStudentAge) && !isNaN(maxStudentAge) && !isNaN(maxStudentQuantity) && !isNaN(passScore)) {
//     try {
//       await setting.update({ minStudentAge, maxStudentAge, maxStudentQuantity, passScore });
//       res.render("settings", {
//         message: "Cập nhật cài đặt thành công!",
//         messageType: "success",
//         setting
//       });
//     }
//     catch(err) {
//       res.render("settings", {
//         message: "Đã có lỗi xảy ra vui lòng thử lại.",
//         messageType: "danger",
//         setting
//       });
//     }

//   } else {
//     res.render("settings", {
//       message: "Xin kiểm tra lại nội dung đã nhập",
//       messageType: "danger",
//       setting
//     });
//   }
// });

module.exports = router;
