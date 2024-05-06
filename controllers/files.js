const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { isFolder } = require('../helpers/isFolder');
const { getRandomInt } = require('../helpers/getRandomInt');

/* Retrieve all files from the BASE_FOLDER_PATH */
const all = (req, res) => {
    const base = process.env.BASE_FOLDER_PATH;
    let path = '';

    if ('path' in req.query) {
        path = req.query.path;
    }

    if (isFolder(base + path)) {
        let files = [];
        let otherItems = [];

        fs.readdirSync(base + path).forEach(item => {
            const isDir = fs.lstatSync(base + path + '/' + item).isDirectory();
            let size = 0;

            if (!isDir) {
                size = fs.statSync(base + path + '/' + item).size;
            }

            const fileInfo = {
                id: getRandomInt(),
                name: item,
                dir: isDir,
                size: isDir ? 0 : size, // For directories, set size to 0
            };

            if (isDir) {
                files.push(fileInfo); // Add files to files array
            } else {
                otherItems.push(fileInfo); // Add directories to otherItems array
            }
        });

        const sortedFiles = files.concat(otherItems); // Concatenate files and otherItems arrays

        res.json({
            path: path,
            result: true,
            files: sortedFiles,
        });
    }
};

/* We open the file in the local version */
const openFile = (req, res) => {
    const { path, filename } = req.body;
    const base = process.env.BASE_FOLDER_PATH;

    if (!filename) {
        res.status(400).send('File parameter is missing');
        return;
    }

    let filePath;

    if (path) {
        filePath = `${base}${path}/${filename}`;
    } else {
        filePath = base + filename;
    }

    /* Checking file existence */
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filename}`);
            res.status(404).send('File not found');
            return;
        }

        const command = process.platform === 'win32' ? `start "" "${filePath}"` : `open "${filePath}"`;

        exec(command, (error) => {
            if (error) {
                console.error(`Error opening file: ${error}`);
                res.status(500).send('Error opening file');
            } else {
                console.log('File opened successfully:', filePath);
                res.send('File opened successfully');
            }
        });
    });
};

/* We open the folder in the local version */
const openFolder = (req) => {
    const { folderPath } = req.body;
    const base = process.env.BASE_FOLDER_PATH;
    const fullPath = base + folderPath;
    exec(`start "" "${fullPath}"`);
}

/* We add a new folder */
const addFolder = (req, res) => {
    const { path, foldername } = req.body;
    const base = process.env.BASE_FOLDER_PATH;

    if (!foldername) {
        res.status(400).send('Folder name is required');
        return;
    }

    let folderPath;

    if (path) {
        folderPath = `${base}${path}/${foldername}`;
    } else {
        folderPath = `${base}/${foldername}`;
    }

    /* Check if folder already exists */
    if (fs.existsSync(folderPath)) {
        res.status(400).send('Folder already exists');
        return;
    }

    /* Create the folder */
    fs.mkdirSync(folderPath);
    res.status(201).send('Folder created successfully');
}

/* We add a new file */
const addFile = (req, res) => {
    const file = req.file;
    
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    return res.status(200).json({ 
        message: 'File uploaded successfully',
    });
};

/* We edit a folder name or file name */
const edit = (req, res) => {
    const { path, oldFileName, newName } = req.body;
    const base = process.env.BASE_FOLDER_PATH;

    let folderPath;

    if (path) {
        folderPath = `${base}/${path}/${oldFileName}`;
    } else {
        folderPath = `${base}/${oldFileName}`;
    }

    try {
        fs.renameSync(folderPath, `${base}/${path}/${newName}`);
        res.json({ success: true, message: 'File or folder name updated successfully.' });
    } catch (error) {
        console.error('Error renaming file or folder:', error);
        res.status(500).json({ success: false, message: 'Error updating file or folder name.' });
    }
}

/* We remove a folder or file */
const remove = (req, res) => {
    const { path, foldername, dir } = req.body;
    const base = process.env.BASE_FOLDER_PATH;

    let newPath;

    if (path) {
        newPath = `${base}/${path}/${foldername}`;
    } else {
        newPath = `${base}/${foldername}`;
    }

    console.log(newPath);

    if (dir) {
        fs.rmdirSync(newPath, { recursive: true });
    } else {
        fs.unlinkSync(newPath);
    }

    res.status(200).send('Deleted successfully');
}

module.exports = {
    all,
    openFile,
    openFolder,
    addFolder,
    addFile,
    edit,
    remove,
}
