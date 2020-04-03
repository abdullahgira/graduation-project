const router = require('express').Router();

const Group = require('../model/Group');
const SchemaValidation = require('../validation/SchemaValidation');
const GroupValidation = require('../validation/GroupValidation');
const StudentValidation = require('../validation/StudentValidation');
const GroupService = require('../service/GroupService');

const { isDoctor } = require('../middleware/authorization');

const groupService = new GroupService(Group, SchemaValidation, GroupValidation, StudentValidation);

router.post('/new', isDoctor, async (req, res) => {
    const group = await groupService.createGroup(req.user._id, req.body);
    res.json(group);
});

router.post('/:groupId/add/:studentId', isDoctor, async (req, res) => {
    const group = await groupService.addStudent(req.params.groupId, req.params.studentId);
    res.json(group);
});

module.exports = router;