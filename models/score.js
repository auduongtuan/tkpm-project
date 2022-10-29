'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Student, {foreignKey: 'studentId', as: 'student'});
      this.belongsTo(models.Subject, {foreignKey: 'subjectId', as: 'subject'});
      this.belongsTo(models.Classroom, {foreignKey: 'classroomId', as: 'classroom'});
    }
  }
  Score.init({
    semester: DataTypes.INTEGER,
    score15min: DataTypes.DOUBLE,
    scoreLesson: DataTypes.DOUBLE,
    scoreFinal: DataTypes.DOUBLE,
    scoreAverage: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.score15min+this.scoreLesson*2+this.scoreFinal*3)/6;
      }
    },
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};