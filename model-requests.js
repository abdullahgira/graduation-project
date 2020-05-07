const winston = require('./config/winston');
const axios = require('axios');

const MODEL_URL=process.env.MODEL_URL

exports.addStudent = async function addStudent(id, videoPath) {
    try {
        const response = await axios.post(`${MODEL_URL}/new_student`, {
            id,
            video_path: `${process.env.VIDEO_PREFIX}/${videoPath}`
        });
        winston.info(`${MODEL_URL}/new_student responded with: ${response.data}`);
    } catch (error) {
        winston.error(`${MODEL_URL}/new_student failed with error: ${error}`)
    }
}

exports.createGroup = async function createGroup(students, groupId) {
    try {
        const response = await axios.post(`${MODEL_URL}/make_section`, {
            ids: students,
            group_name: groupId
        });
        winston.info(`${MODEL_URL}/make_section responded with: ${response.data}`);
    } catch (error) {
        winston.error(`${MODEL_URL}/make_section failed with error: ${error}`)
    }
}

exports.recordAttendance = async function recordAttendance(groupId, imageLink) {
    try {
        const response = await axios.post(`${MODEL_URL}/predict`, {
            image: `${process.env.VIDEO_PREFIX}/${imageLink}`,
            group_name: groupId
        });
        winston.info(`${MODEL_URL}/predict responded with: ${response.data.label}`);
        return response.data.label
    } catch (error) {
        winston.error(`${MODEL_URL}/predict failed with error: ${error}`)
    }
}