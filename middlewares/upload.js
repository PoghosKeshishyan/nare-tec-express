const fs = require('fs');
const multer = require('multer');

/* Setting up Multer to handle file uploads */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { path } = req.query;

        if (!path) {
            cb(new Error('Path not provided'), null);
            return;
        }

        const fullPath = process.env.BASE_FOLDER + path;

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath); // Specify the path to save files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // File name
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
}