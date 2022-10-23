const controller = {};
const models = require("../models");
const Setting = models.Setting;
const { Op } = require("sequelize");

controller.getOrCreate = async () => {
  try {
    const setting = await Setting.findOne();
    if (setting) {
      return setting;
    }
    else {
      const newSetting = await Setting.create({
        minStudentAge: 15,
        maxStudentAge: 20,
        maxStudentQuantity: 40,
        passScore: 5,
      });
      return newSetting;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

controller.getAll = async () => {
  return await Classroom.findAll();
};

module.exports = controller;
