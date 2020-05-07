const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'doctor']
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('User already exists'));
    } else {
        next(error);
    }
});

userSchema.methods.hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async (passedPassword, password) => {
    return await bcrypt.compare(passedPassword, password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin, role: this.role }, process.env.JWT_PRIVATE_KEY);
};

module.exports = mongoose.model('User', userSchema);
