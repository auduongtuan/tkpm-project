const helpers = {};
helpers.createStars = (rating) => {
    let str = '';
    let i;
    for(i=1; i <= rating; i++) {
        str += '<i class="fa fa-star"></i>';
    }
    for(; i <=5; i++)
    {
        str += '<i class="fa fa-star disabled"></i>';
    }
    return str;
}
helpers.createStarList = (stars) => {
    let str = '<ul class="list">';
    for(let i = 5; i > 0; i--) {
        str += `<li><a href="#">${i} Star ${helpers.createStars(i)} ${stars[i]}</a></li>`
    }
    str += '</ul>';
    return str;
};

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


module.exports = helpers;