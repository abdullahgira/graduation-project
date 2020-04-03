const router = require('express').Router();

const Group = require('../model/Group');
const SchemaValidation = require('../validation/SchemaValidation');
const GroupService = require('../service/GroupService');

const { isDoctor } = require('../middleware/authorization');

const groupService = new GroupService(Group, SchemaValidation);

router.post('/new', isDoctor, async (req, res) => {
    const group = await groupService.createGroup(req.user._id, req.body);
    res.json(group);
});

module.exports = router;