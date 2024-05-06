const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const { 
    all, 
    openFile,
    openFolder, 
    addFolder, 
    addFile, 
    edit, 
    remove, 
} = require('../controllers/files');

router.get('/', all);
router.post('/open/file', openFile);
router.post('/open/folder', openFolder);
router.post('/add/folder', addFolder);
router.post('/add/file', upload.single('file'), addFile);
router.put('/edit', edit);
router.delete('/remove', remove);

module.exports = router;
