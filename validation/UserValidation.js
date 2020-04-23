const User = require('../model/User');
const GPError = require('../error/GPError');

class UserValidation {

    async validateUserExistsAndReturn(userId) {
        const user = await User.findById(userId);
        if (!user) throw new GPError.InvalidId();
        return user;
    }

}

module.exports = UserValidation;