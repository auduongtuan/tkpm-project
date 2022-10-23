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

controller.getAllOrderedByClassroom = async () => {
  return await Student.findAll({
    include: [{
      model: models.Classroom,
      as: 'classroom'
    }],
    order: [
      ['classroomId', 'DESC']
    ]
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

controller.updateClassroomIds = async (classroomId, studentIds) => {
  // reset students that not in student id list
  await Student.update({classroomId: null}, {
    where: {
      classroomId: classroomId,
      id: {
        [Op.notIn]: studentIds
      }
    }
  });

  return await Student.update({classroomId: classroomId}, {
    where: {
      id: studentIds
    }
  });
}


module.exports = controller;
