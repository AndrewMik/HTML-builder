const fs = require('fs/promises');
const path = require('path');

const SOURCE_FOLDER_NAME = 'secret-folder';
const ADDITION = ' - ';
const BYTES = 'bytes';

const folderPath = path.join(__dirname, SOURCE_FOLDER_NAME);

fs.readdir(folderPath, { withFileTypes: true})
  .then(dirents => {
    dirents.forEach( dirent => {
      if(!dirent.isDirectory()){
        const pathToFile = path.join(folderPath, dirent.name);
        const fileInfo = path.parse(pathToFile);

        fs.stat(pathToFile)
          .then(result => {
            const fileSizeInBytes = result.size;
            console.log(fileInfo.name + ADDITION + fileInfo.ext.replace('.', '') + ADDITION + fileSizeInBytes + ' ' + BYTES);
          });
      }
    }); 
  });
