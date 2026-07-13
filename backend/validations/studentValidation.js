const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  programId: Joi.string().required(),

  sectionId: Joi.string().required(),

  enrollmentNumber: Joi.string().trim().uppercase().required(),

  rollNumber: Joi.number().integer().required(),

  admissionYear: Joi.number().integer().required(),

  guardianName: Joi.string().required(),

  guardianPhone: Joi.string().required(),

  address: Joi.string().required(),

  dateOfBirth: Joi.date().required(),
});

module.exports = studentSchema;