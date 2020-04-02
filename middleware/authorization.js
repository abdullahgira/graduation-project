const { verify } = require('jsonwebtoken');
const GPError = require('../error/GPError');

const _getUser = (req) => {
    const token = req.header('Authorization') ? req.header('Authorization').split(' ')[1] : req.header('Authorization');
    if (!token) throw new GPError.InvalidToken();

    const decoded = verify(token, process.env.JWT_PRIVATE_KEY);
    if (decoded) {
        req.user = decoded;
        return req;
    }
}

exports.isAdmin = (req, res, next) => {
    _getUser(req);
    if (req.user.isAdmin) next();
    else throw new GPError.Forbidden();
}

exports.isAdminOrModerator = (req, res, next) => {
    _getUser(req);
    if (req.user.isAdmin || req.user.role === 'moderator') next();
    else throw new GPError.Forbidden();
}

// exports.isModerator = (req, res, next) => {}

// exports.isDoctor = (req, res, next) => {}