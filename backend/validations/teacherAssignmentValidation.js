const Joi = require("joi");

const teacherAssignmentSchema = Joi.object({
  teacherId: Joi.string().required(),
  subjectId: Joi.string().required(),
  sectionId: Joi.string().required(),
});

module.exports = teacherAssignmentSchema;