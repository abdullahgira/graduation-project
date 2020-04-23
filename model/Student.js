const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    department: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true,
    },
    videoLink: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'StudentGroup'
    }],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Student', studentSchema);
