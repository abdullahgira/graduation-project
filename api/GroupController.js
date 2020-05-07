const router = require('express').Router();
const multer = require('multer');
const mongoose = require('mongoose');

const Group = require('../model/Group');
const StudentGroup = require('../model/StudentGroup');
const SchemaValidation = require('../validation/SchemaValidation');
const GroupValidation = require('../validation/GroupValidation');
const StudentValidation = require('../validation/StudentValidation');
const GroupService = require('../service/GroupService');
const ModelRequests = require('../model-requests');

const { isOnlyDoctor } = require('../middleware/authorization');

const storageConfig = require('../config/diskStorageConfigImage');
const upload = multer({ storage: storageConfig });

const groupService = new GroupService(
    Group, 
    mongoose, 
    StudentGroup, 
    SchemaValidation, 
    GroupValidation, 
    StudentValidation,
    ModelRequests
);

router.use(isOnlyDoctor);

router.post('/new', async (req, res) => {
    const group = await groupService.createGroup(req.user._id, req.body);
    res.json(group);
});

router.post('/:groupId/add', async (req, res) => {
    const group = await groupService.addStudent(req.params.groupId, req.body);
    res.json(group);
});

router.get('/:groupId/done', async (req, res) => {
    await groupService.addStudentsToFacesModel(req.params.groupId);
    res.end();
});

router.get('/', async (req, res) => {
    const groups = await groupService.getGroups(req.user._id);
    res.json(groups);
});

router.post('/:groupId/new-attendance-record', async (req, res) => {
    console.log(req.body);
    if (!req.body.date) throw new Error('Date is required');
    const group = await groupService.addNewAttendanceRecord(req.params.groupId, req.body.date);
    res.json(group);
});

router.post('/:groupId/record-attendance/:attendanceId', upload.single('image'), async (req, res) => {
    const imageLink = req.file && `uploads/${req.file.filename}`;
    const student = await groupService.recordStudentAttendance(req.params.groupId, req.params.attendanceId, imageLink);
    res.json(student);
});

router.get('/:groupId/attendees/:attendanceId', async (req, res) => {
    const attendees = await groupService.getAttendees(req.params.groupId, req.params.attendanceId);
    res.json(attendees);
});

router.get('/:groupId/absent/:attendanceId', async (req, res) => {
    const absent = await groupService.getAbsent(req.params.groupId, req.params.attendanceId);
    res.json(absent);
});

router.get('/:groupId/attendance', async (req, res) => {
    const attendance = await groupService.getGroupAttendance(req.params.groupId);
    res.json(attendance);
});

module.exports = router;