const helpers = {};
helpers.getAge = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return new Date().getFullYear() - date.getFullYear();
}
module.exports = helpers;
