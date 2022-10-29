const service = {};
const models = require("../models");
const Student = models.Student;
const { Op } = require("sequelize");

service.create = async ({fullname, gender, birthdate, address, email, classroomId}) => {
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


service.getAll = async (args = {}) => {
  return await Student.findAll({
    include: [{
      model: models.Classroom,
      as: 'classroom'
    }],
    order: [['id', 'ASC']],
    ...args
  });
}

service.search = async (search) => {
  const criteria = [
    {
      fullname: {
        [Op.iLike]: `%${search}%`
      }
    }
  ];
  if(!isNaN(search)) {
    criteria.push(
      {
        id: parseInt(search)
      }
    );
  }
  return await service.getAll({
    where: {
      [Op.or]: criteria
    }
  });
}

service.getAllOrderedByClassroom = async () => {
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

service.getById = async (id) => {
  return await Student.findByPk(id, {
    // include: [{
    //   model: models.Classroom,
    //   as: 'classroom'
    // }]
  });
}

service.updateClassroomIds = async (classroomId, studentIds) => {
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
service.delete = async(id) => {
  return await Student.destroy({
    where: {
      id: id
    }
  })
}

module.exports = service;
