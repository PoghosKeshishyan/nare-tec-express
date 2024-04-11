/* Function to check if a path is a folder */
const fs = require('fs');

const isFolder = (path) => {
    return fs.lstatSync(path).isDirectory() && fs.existsSync(path);
}

module.exports = {
    isFolder,
}
