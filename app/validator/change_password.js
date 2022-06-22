const Joi = require('joi');

const validator = require('express-joi-validation').createValidator({})
const querySchema = Joi.object({
    current_password : Joi.string().required(),
    new_password : Joi.string().required(),
    confirm_password : Joi.string().required(),
});


module.exports = querySchema;