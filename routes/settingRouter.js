const express = require("express");
const router = express.Router();
const settingService = require("../services/settingService");
const classroomService = require("../services/classroomService");

router.use((req, res, next) => {
  res.locals.page = "setting";
  next();
});

router.get("/", async (req, res) => {
  const setting = await settingService.getOrCreate();
  res.render("settings", { setting });
});

router.post("/", async (req, res) => {
  const setting = await settingService.getOrCreate();
  const { minStudentAge, maxStudentAge, maxStudentQuantity, passScore } =
    req.body;
  if (setting && !isNaN(minStudentAge) && !isNaN(maxStudentAge) && !isNaN(maxStudentQuantity) && !isNaN(passScore)) {
    try {
      await setting.update({ minStudentAge, maxStudentAge, maxStudentQuantity, passScore });
      res.render("settings", {
        message: "Cập nhật cài đặt thành công!",
        messageType: "success",
        setting
      });
    }
    catch(err) {
      res.render("settings", {
        message: "Đã có lỗi xảy ra vui lòng thử lại.",
        messageType: "danger",
        setting
      });
    }
  
  } else {
    res.render("settings", {
      message: "Xin kiểm tra lại nội dung đã nhập",
      messageType: "danger",
      setting
    });
  }
});

module.exports = router;
