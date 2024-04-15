const fs = require('fs');
const path = require('path');

function setupProjectFolder() {
  const desktopPath = path.join(require('os').homedir(), 'Desktop');

  /* Path to the "nareⓀ files" folder */
  const basePath = path.join(desktopPath, 'nareⓀ files');

  /* Check if the "nareⓀ files" folder exists */
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath); /* Create the "nareⓀ files" folder */

    /* Create four subfolders inside "nareⓀ files" */
    for (let i = 1; i <= 4; i++) {
      fs.mkdirSync(path.join(basePath, `New folder (${i})`));
    }

    /* Update the .env file with the correct path */
    const envFilePath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envFilePath, 'utf8');

    /* Check for the existence of BASE_FOLDER_PATH */
    if (envContent.includes('BASE_FOLDER_PATH')) {
      /* Remove the old BASE_FOLDER_PATH */
      envContent = envContent.replace(/BASE_FOLDER_PATH=".*"\n/, '');
    }

    /* We replace the "\" character with a "/" to send to the React application */
    const basePathEnv = basePath.replace(/\\/g, '/');

    /* Add the new BASE_FOLDER_PATH */
    envContent += `BASE_FOLDER_PATH="${basePathEnv}"\n`;
    fs.writeFileSync(envFilePath, envContent);
  }
}

module.exports = setupProjectFolder;
