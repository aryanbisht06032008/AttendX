const Joi = require("joi");

const courseSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  code: Joi.string().trim().uppercase().min(2).max(20).required(),

  durationYears: Joi.number().integer().min(1).required(),

  totalSemesters: Joi.number().integer().min(1).required(),
});

module.exports = courseSchema;