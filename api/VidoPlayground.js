const router = require('express').Router();
const multer = require('multer');

const storageConfig = require('../config/diskStorageConfig');
const upload = multer({ storage: storageConfig });

router.post('/', upload.single('video'), (req, res) => {
    console.log(`body: ${JSON.stringify(req.body)}`);
    console.log(`video: ${req.file ? (JSON.stringify(req.file.filename)) : undefined}`);

    res.end();
});

module.exports = router;