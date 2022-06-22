const Joi = require('joi');

const validator = require('express-joi-validation').createValidator({})
const querySchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().required().email(),
    role : Joi.string().required(),
});


module.exports = querySchema;