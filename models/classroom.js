'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Student, {foreignKey: 'classroomId', as: 'students'});
      this.hasMany(models.Score, {foreignKey: 'classroomId', as: 'scores'});
    }
  }
  Classroom.init({
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
    grade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Classroom',
  });
  return Classroom;
};