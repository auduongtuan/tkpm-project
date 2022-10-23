const controller = {};
const models = require("../models");
const Score = models.Score;
const { Op } = require("sequelize");

controller.create = async ({name}) => {
  try {
    const score = await Score.create({name});
    return score;
  }
  catch(err) {
    console.log(err);
    return false;
  }
}


controller.getAll = async () => {
  return await Score.findAll();
}




controller.getById = async (id) => {
  return await Score.findByPk(id, {
  });
}


module.exports = controller;
