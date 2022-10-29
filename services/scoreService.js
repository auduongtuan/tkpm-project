const service = {};
const models = require("../models");
const {Score, Classroom, Student, Subject} = models;
const subjectService = require("../services/subjectService");
const { Op } = require("sequelize");

service.getScoreDataByCourse = async (classroomId, subjectId, semester) => {
  const scores = await service.getScoresByCourse(
    classroomId,
    subjectId,
    semester
  );
  return scores.reduce((r, s) => {
    const { score15min, scoreLesson, scoreFinal } = s;
    r[s.studentId] = { score15min, scoreLesson, scoreFinal };
    return r;
  }, Object.create(null));
}

service.getScoresByCourse = async (classroomId, subjectId, semester) => {
  return await Score.findAll({
    where: {
      classroomId: classroomId,
      subjectId: subjectId,
      semester: semester
    }
  });
}

service.updateScoresByCourse = async (classroomId, subjectId, semester, scoreData) => {
  for(const studentId in scoreData) {
    const [score, created] = await Score.findOrCreate({
      where: {
        classroomId, subjectId, studentId, semester
      },
      defaults: {
        score15min: null,
        scoreLesson: null,
        scoreFinal: null
      }
    });
    // console.log(score);
    await score.update({
      score15min: scoreData[studentId].score15min,
      scoreLesson: scoreData[studentId].scoreLesson,
      scoreFinal: scoreData[studentId].scoreFinal  
    });
  }
}




service.getById = async (id) => {
  return await Score.findByPk(id, {
  });
}

service.getScoreByStudentSemesterSubject = async(studentId, year, semester, subjectId) => {
  const score = await Score.findOne({
    include: [
      {
        model: Student,
        as: 'student',
        where: {
          id: studentId
        }
      },
      {
        model: Classroom,
        as: 'classroom',
        where: {
          year: year
        }
      },
      {
        model: Subject,
        as: 'subject',
        where: {
          id: subjectId
        }
      }
    ],
    where: {
      semester: semester
    }
  });
  return score;  
}

service.getScoresByStudentSemester = async(studentId, year, semester) => {
  const subjects = await subjectService.getAll();
  const scores = await Score.findAll({
    include: [
      {
        model: Student,
        as: 'student',
        where: {
          id: studentId
        }
      },
      {
        model: Classroom,
        as: 'classroom',
        where: {
          year: year
        }
      },
      {
        model: Subject,
        as: 'subject'
      }
    ],
    where: {
      semester: semester
    }
  });
  return scores;  
};

service.getAverageScoreByStudentSemester = async(studentId, semester, year) => {
  const scores = await service.getScoresByStudentSemester(studentId, year, semester);
  return scores.reduce((acc, s) => acc + s.scoreAverage, 0) / scores.length;
}

module.exports = service;
