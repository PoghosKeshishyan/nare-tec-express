/* Function for creating a project folder on boot */

const fs = require('fs');
const path = require('path');

function setupProjectFolder() {
  const basePath = process.env.BASE_FOLDER_PATH;

  /* Check if the "nareⓀ files" folder exists */
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);

    /* Create four subfolders inside "nareⓀ files" */
    for (let i = 1; i <= 4; i++) {
      fs.mkdirSync(path.join(basePath, `New folder (${i})`));
    }

    /* Create a new folder inside "nareⓀ files" */
    const additionalFolder = path.join(basePath, 'Images');
    fs.mkdirSync(additionalFolder);

    /* Copy the content of logo.jpg from public/images to the new folder */
    const sourceFile = path.join(__dirname, '../public/images/logo.jpg');
    const destinationFile = path.join(additionalFolder, 'logo.jpg');
    fs.copyFileSync(sourceFile, destinationFile);
  }
}

module.exports = {
  setupProjectFolder,
};
