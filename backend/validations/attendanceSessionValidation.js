const Joi = require("joi");

const attendanceSessionSchema = Joi.object({
  teacherAssignmentId: Joi.string().required(),
});

module.exports = attendanceSessionSchema;