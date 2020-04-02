const router = require('express').Router();
const multer = require('multer');

const Student = require('../model/Student');
const SchemaValidation = require('../validation/SchemaValidation');
const StudentValidation = require('../validation/StudentValidation');
const StudentService = require('../service/StudentService');

const { isAdminModeratorOrDoctor } = require('../middleware/authorization');

const studentService = new StudentService(Student, SchemaValidation, StudentValidation, null);

const storageConfig = require('../config/diskStorageConfig');
const upload = multer({ storage: storageConfig });

router.post('/new', isAdminModeratorOrDoctor, upload.single('video'), async (req, res) => {
    const videoLink = req.file && `uploads/${req.file.filename}`;
    const student = await studentService.addStudent(req.body, videoLink);
    res.json(student);
});

module.exports = router;