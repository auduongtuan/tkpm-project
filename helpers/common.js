const helpers = {};
helpers.getAge = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return helpers.getCurrentYear() - date.getFullYear();
}
helpers.getCurrentYear = () => {
  return new Date().getFullYear();
}
module.exports = helpers;
