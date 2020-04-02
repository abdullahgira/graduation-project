const { verify } = require('jsonwebtoken');
const GPError = require('../error/GPError');

const _getUser = (req) => {
    let token = req.header('Authorization') ? req.header('Authorization').split(' ')[1] : req.header('Authorization');
    if (!token) throw new GPError.InvalidToken();
    
    try {
        const decoded = verify(token, process.env.JWT_PRIVATE_KEY);
        if (decoded) {
            req.user = decoded;
            return req;
        }
    } catch(e) {
        throw new GPError.InvalidToken();
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

exports.isAdminModeratorOrDoctor = (req, res, next) => {
    _getUser(req);
    if (req.user.isAdmin || req.user.role === 'moderator' || req.user.role === 'doctor') next();
    else throw new GPError.Forbidden();
}