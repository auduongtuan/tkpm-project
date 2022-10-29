const service = {};
const models = require("../models");
const Subject = models.Subject;
const { Op } = require("sequelize");

service.create = async ({name}) => {
  try {
    const subject = await Subject.create({name});
    return subject;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}


service.getAll = async () => {
  return await Subject.findAll();
}

service.delete = async(id) => {
  return await Subject.destroy({
    where: {
      id: id
    }
  })
}

service.getById = async (id) => {
  return await Subject.findByPk(id, {
  });
}


module.exports = service;
