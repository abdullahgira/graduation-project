const router = require('express').Router();

const UserService = require('../service/UserService');
const User = require('../model/User');
const SchemaValidation = require('../validation/SchemaValidation');
const GPError = require('../error/GPError');

const { isAdmin, isModerator } = require('../middleware/authorization');

const userService = new UserService(User, SchemaValidation, GPError);

router.post('/register/admin', isAdmin, async (req, res) => {
    const user = await userService.register(req.body);
    res.json(user);
});

router.post('/register/moderator', isAdmin, async (req, res) => {
    const user = await userService.register(req.body);
    res.json(user);
});

router.post('/register/doctor', isModerator, async (req, res) => {
    const user = await userService.register(req.body);
    res.json(user);
});

router.post('/login', async (req, res) => {
    const user = await userService.login(req.body);
    res.json({ _id: user.id, name: user.name, token: user.generateAuthToken() });
});

module.exports = router;