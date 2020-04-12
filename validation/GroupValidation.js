const Joi = require('@hapi/joi');

const Group = require('../model/Group');
const GPError = require('../error/GPError');

class GroupValidation {
    
    static async validateGroupExistsAndReturn(groupId) {
        const group = await Group.findById(groupId);
        if (!group) throw new GPError.InvalidId(`Invalid group id`);
        return group;
    }

    static async vlaidateStudentIsNotInGroup(groupId, studentId) {
        const group = await Group.findById(groupId);
        for (let student of group.students) {
            if (student == studentId) 
                throw new GPError.DuplicateError(`Student is already in the group`);
        }
    }

}

module.exports = GroupValidation;