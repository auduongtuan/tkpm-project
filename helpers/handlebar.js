const helpers = {};

helpers.ifEquals = (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
};

helpers.checked = function(value, test) {
    if (value == undefined) return '';
    return value==test ? 'checked' : '';
};

helpers.selected = function(value, test) {
    if (value == undefined) return '';
    return value==test ? 'selected' : '';
};

helpers.gender = function(value) {
    return value==1 ? 'Nữ' : 'Nam';
}

helpers.json = function(value) {
    return JSON.stringify(value);
}

helpers.inc = function(value) {
    return parseInt(value) + 1;
}

helpers.percentage = function(value1, value2) {
    if (value2 == 0) return '0.00%';
    return (value1/value2*100).toFixed(2) + '%';
}
module.exports = helpers;