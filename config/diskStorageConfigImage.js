const multer = require('multer');
const path = require('path');

module.exports = multer.diskStorage({
    destination: './uploads',
    limits: { fileSize: 1024 * 1024 * 15 },
    filename(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    fileFilter(req, file, cb) {
        const filetypes = /png|jpg|jpeg/i;
        const extname = filetypes.test(path.extname(file.originalname));
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) return cb(null, true);
        else return cb('Error the given file isn\'t an image');
    }
});
