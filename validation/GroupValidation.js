const Joi = require('@hapi/joi');

const Group = require('../model/Group');
const GPError = require('../error/GPError');

class GroupValidation {
    
    static async validateGroupExistsAndReturn(groupId) {
        const group = await Group.findById(groupId);
        if (!group) throw new GPError.InvalidId(`Invalid group id`);
        return group;
    }

}

module.exports = GroupValidation;