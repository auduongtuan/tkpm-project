const controller = {};
const models = require("../models");
const Classroom = models.Classroom;
const { Op } = require("sequelize");

controller.create = async ({name, year, grade}) => {
  try {
    const classroom = await Classroom.create({name, year, grade});
    return classroom;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}

controller.getAll = async () => {
  return await Classroom.findAll();
}

controller.getById = async (id) => {
  return await Classroom.findByPk(id, {
    include: {
      model: models.Student,
      as: 'students'
    }
  });
}


controller.getAllWithStudents = async () => {
  return await Classroom.findAll({
    include: {
      model: models.Student,
      as: 'students'
    }
  });
}

module.exports = controller;
