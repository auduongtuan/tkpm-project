const controller = {};
const models = require("../models");
const Student = models.Student;
const { Op } = require("sequelize");

controller.create = async ({fullname, gender, birthdate, address, email, classroomId}) => {
  if (!classroomId) classroomId = null;
  try {
    const student = await Student.create({fullname, gender, birthdate, address, email, classroomId});
    return student;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}


controller.getAll = async () => {
  return await Student.findAll({
    include: [{
      model: models.Classroom,
      as: 'classroom'
    }]
  });
}

controller.getById = async (id) => {
  return await Student.findByPk(id, {
    // include: [{
    //   model: models.Classroom,
    //   as: 'classroom'
    // }]
  });
}



module.exports = controller;
