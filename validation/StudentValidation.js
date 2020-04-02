const Joi = require('@hapi/joi');

const Student = require('../model/Student');
const GPError = require('../error/GPError');

class StudentValidation {
    
    static async validateStudentDoesntExist(email) {
        const student = await Student.findOne({ email });
        if (student) throw new GPError.DuplicateError();
        return;
    }

}

module.exports = StudentValidation;