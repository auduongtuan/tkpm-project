const service = {};
const models = require("../models");
const Classroom = models.Classroom;
const Score = models.Score;
const { Op } = require("sequelize");
const subjectService = require("../services/subjectService");
const scoreService = require("../services/scoreService");
const settingService = require("../services/settingService");

service.create = async ({name, year, grade}) => {
  try {
    const classroom = await Classroom.create({name, year, grade});
    return classroom;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}

service.getAll = async (args = {}) => {
  return await Classroom.findAll({
    order: [
      ['year', 'ASC'],
      ['name', 'ASC']
    ],
    ...args
  });
}

service.getById = async (id) => {
  return await Classroom.findByPk(id, {
    include: {
      model: models.Student,
      as: 'students'
    }
  });
}

service.getYears = async (id) => {
  const years = await Classroom.findAll({
    attributes: ['year'],
    group: ['year'],
    raw: true
  });
  return years.map(item => item.year);
}
service.getByIdWithScores = async (id) => {
  return await Classroom.findByPk(id, {
    include: [
      {
        model: models.Student,
        as: 'students'
      }
    ],
  });
}


service.getAllWithStudents = async (args = {}) => {
  return await service.getAll({
    include: {
      model: models.Student,
      as: 'students'
    },
    ...args
  });
}

service.getPassedQuantity = async (semester) => {
  const scores = Score.findAll({
    includes: [
      {
        models: Classroom,
        as: 'classroom'
      },
      {
        models: Student,
        as: 'student'
      },
      {
        model: models.Subject,
        as: 'subject'
      }
    ]
  })
}

service.getAllWithPassedQuantityBySubject = async(year, semester, subjectId) => {
  const classrooms = await service.getAllWithStudents({
    where: {
      year: year,
    },
  });
  const {passScore} = await settingService.getOrCreate();
  for(const classroom of classrooms) {
    let passedQuantity = 0;
    for await (const student of classroom.students) {
      const score = await scoreService.getScoreByStudentSemesterSubject(student.id, year, semester, subjectId);      
      if(score && score.scoreAverage > passScore) {
        passedQuantity++;
      }
    }
    classroom.passedQuantity = passedQuantity;
  }
  return classrooms;
}

service.getAllWithPassedQuantityBySemester = async(year, semester) => {
  const classrooms = await service.getAllWithStudents({
    where: {
      year: year,
    },
  });
  const {passScore} = await settingService.getOrCreate();
  const subjects = await subjectService.getAll();
  for(const classroom of classrooms) {
    let passedQuantity = 0;
    for await (const student of classroom.students) {
      const scores = await scoreService.getScoresByStudentSemester(student.id, year, semester);
      let passedSubjectQuantity = 0;
      for await (const score of scores) {
        if(score.scoreAverage > passScore) {
          passedSubjectQuantity++;
        }
      }
      if(passedSubjectQuantity == subjects.length) passedQuantity++;
    }
    classroom.passedQuantity = passedQuantity;
  }
  return classrooms;
}

service.delete = async(id) => {
  return await Classroom.destroy({
    where: {
      id: id
    }
  })
}

module.exports = service;
