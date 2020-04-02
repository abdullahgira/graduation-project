const router = require('express').Router();

const Student = require('../model/Student');
const SchemaValidation = require('../validation/SchemaValidation');
const StudentValidation = require('../validation/StudentValidation');
const StudentService = require('../service/StudentService');

const { isAdminModeratorOrDoctor } = require('../middleware/authorization');

const studentService = new StudentService(Student, SchemaValidation, StudentValidation, null);

router.post('/new', isAdminModeratorOrDoctor, async (req, res) => {
    const student = await studentService.addStudent(req.body, 'video link placeholder');
    res.json(student);
});

module.exports = router;