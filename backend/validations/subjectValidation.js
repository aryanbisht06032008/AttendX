const Joi = require("joi");

const subjectSchema = Joi.object({
  semesterId: Joi.string().required(),

  name: Joi.string().trim().min(3).max(150).required(),

  code: Joi.string().trim().uppercase().required(),

  credits: Joi.number().integer().min(1).max(10).required(),

  type: Joi.string()
    .valid("THEORY", "PRACTICAL", "LAB")
    .required(),
});

module.exports = subjectSchema;