"use strict";
const { Model } = require("sequelize");
const {getAge} = require("../helpers/common");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Score, { foreignKey: "studentId", as: "scores" });
      this.belongsTo(models.Classroom, {
        foreignKey: "classroomId",
        as: "classroom",
      });
    }
  }
  Student.init(
    {
      fullname: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      birthdate: {
        type: DataTypes.DATE,
        // get: function () {
        //   return this.getDataValue("birthdate").toLocaleString("vi-VN", {
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //   });
        // },
      },
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      age: {
        type: DataTypes.VIRTUAL,
        get() {
          return getAge(this.birthdate);
        }
      },
      semester1AverageScore: {
        type: DataTypes.VIRTUAL,
        get() {

        }
      },
      semester2AverageScore: {
        type: DataTypes.VIRTUAL,
        get() {
          
        }
      }
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  
  return Student;
};
