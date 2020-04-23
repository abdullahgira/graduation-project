const router = require('express').Router();

const Group = require('../model/Group');
const StudentGroup = require('../model/StudentGroup');
const SchemaValidation = require('../validation/SchemaValidation');
const GroupValidation = require('../validation/GroupValidation');
const StudentValidation = require('../validation/StudentValidation');
const GroupService = require('../service/GroupService');

const { isOnlyDoctor } = require('../middleware/authorization');

const groupService = new GroupService(Group, StudentGroup, SchemaValidation, GroupValidation, StudentValidation);

router.post('/new', isOnlyDoctor, async (req, res) => {
    const group = await groupService.createGroup(req.user._id, req.body);
    res.json(group);
});

router.post('/:groupId/add', isOnlyDoctor, async (req, res) => {
    const group = await groupService.addStudent(req.params.groupId, req.body);
    res.json(group);
});

router.get('/', isOnlyDoctor, async (req, res) => {
    const groups = await groupService.getGroups(req.user._id);
    res.json(groups);
});

module.exports = router;