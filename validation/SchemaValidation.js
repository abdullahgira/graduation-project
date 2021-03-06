const Joi = require('@hapi/joi');
const GPError = require('../error/GPError');

class Validation {
    static async validateNewUser(userDTO) {
        const schema = Joi.object({
            name: Joi.string()
                .min(2)
                .max(255)
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .max(255)
                .required(),
            password: Joi.string()
                .min(6)
                .max(255)
                .required(),
            role: Joi.string()
                .valid('admin', 'moderator', 'doctor')
                .required(),
        });
        const { error } = schema.validate(userDTO);
        if (error) throw new GPError.ValidationError(error);
    }

    static async validateUserLogin(userDTO) {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .max(255)
                .required(),
            password: Joi.string()
                .min(6)
                .max(255)
                .required(),
            role: Joi.string()
                .valid('admin', 'moderator', 'doctor')
                .required(),
        });
        const { error } = schema.validate(userDTO);
        if (error) throw new GPError.ValidationError(error);
    }

    static async validateNewStudent(studentDTO) {
        const schema = Joi.object({
            name: Joi.string()
                .min(2)
                .max(255)
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .max(255)
                .required(),
            department: Joi.string()
                .min(2)
                .max(255)
                .required()
        });
        const { error } = schema.validate(studentDTO);
        if (error) throw new GPError.ValidationError(error);
    }

    static async validateNewGroup(groupDTO) {
        const schema = Joi.object({
            name: Joi.string()
                .min(2)
                .max(255)
                .required(),
            students: Joi.array()
                .items(Joi.string()
                    .min(24)
                    .max(24)
                )
        });
        const { error } = schema.validate(groupDTO);
        if (error) throw new GPError.ValidationError(error);
    }

    static async validateAddStudentToGroup(studentDTO) {
        const schema = Joi.object({
            studentId: Joi.string()
                .min(24)
                .max(24)
        });
        const { error } = schema.validate(studentDTO);
        if (error) throw new GPError.ValidationError(error);
    }
}

module.exports = Validation;