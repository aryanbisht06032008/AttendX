const Joi = require("joi");

const programSchema = Joi.object({
  departmentId: Joi.string().required(),
  courseId: Joi.string().required(),
  name: Joi.string().trim().min(3).max(150).required(),
  code: Joi.string().trim().uppercase().required(),
  totalSeats: Joi.number().integer().min(1).required(),
});

module.exports = programSchema;