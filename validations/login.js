const Validator = require("validator");
const isEmpty = require("../validations/is-empty");
module.exports = function validateLoginInput(data) {

    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';



    if (Validator.isEmpty(data.email)) {
        errors.email = "Email Field is Required"
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is not Valid"
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "password Field is Required"
    }





    return {
        errors,
        isValid: isEmpty(errors)
    }
}