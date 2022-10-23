const controller = {};
const models = require("../models");
const Subject = models.Subject;
const { Op } = require("sequelize");

controller.create = async ({name}) => {
  try {
    const subject = await Subject.create({name});
    return subject;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}


controller.getAll = async () => {
  return await Subject.findAll();
}


module.exports = controller;
