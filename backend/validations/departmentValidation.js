const Joi = require("joi");

const departmentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  code: Joi.string().trim().uppercase().min(2).max(10).required(),
});

module.exports = departmentSchema;