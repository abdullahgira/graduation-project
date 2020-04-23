const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentGroupSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    },
    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    attendance: [{
        attended: Boolean,
        date: Date
    }]
});

module.exports = mongoose.model('StudentGroup', studentGroupSchema);
