exports.Forbidden = class Forbidden extends Error {
    constructor(message = 'This user is not authorized for this type of action') {
        super(message);
        this.name = 'Forbidden';
        this.statusCode = 403;
    }
}

exports.InvalidToken = class InvalidToken extends Error {
    constructor(message = 'Invalid token') {
        super(message);
        this.name = 'InvalidToken';
        this.statusCode = 405;
    }
}

exports.ValidationError = class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 406;
    }
}

exports.InvalidCredentials = class InvalidCredentials extends Error {
    constructor(message='Invalid username or password') {
        super(message);
        this.name = 'InvalidCredentials';
        this.statusCode = 406;
    }
}

exports.DuplicateError = class DuplicateError extends Error {
    constructor(message='User already exists') {
        super(message);
        this.name = 'DuplicateError';
        this.statusCode = 406;
    }
}
