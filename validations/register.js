const Validator = require("validator");
const isEmpty = require("../validations/is-empty");
module.exports = function validateRegisterInput(data) {

    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!Validator.isLength(data.name, {
            min: 4,
            max: 30
        })) {
        errors.name = "Name must be between 4 and 30"
    }


    if (Validator.isEmpty(data.name)) {
        errors.name = "Name Field is Required"
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email Field is Required"
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is not Valid"
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "password Field is Required"
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = "password must be at least 6 characters"
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "confirmation password Field is Required"
    }


    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Password must match"
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}