const fs = require('fs');
const path = require('path');
const multer = require('multer');

/* Setting up Multer to handle file uploads */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userPath = req.query.path;

        const publicPath = path.join(__dirname, '..', 'public', 'images');
        let fullPath;

        if (userPath) {
            fullPath = path.join(process.env.BASE_FOLDER_PATH, userPath);
        } else {
            const desktopPath = path.join(require('os').homedir(), 'Desktop');
            const basePath = path.join(desktopPath, 'nareⓀ files');
            const imagesFolder = path.join(basePath, 'Images');

            if (!fs.existsSync(imagesFolder)) {
                fs.mkdirSync(imagesFolder, { recursive: true });
            }
            
            fullPath = imagesFolder;
        }

        cb(null, fullPath);
        cb(null, publicPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
}
