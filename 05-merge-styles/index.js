const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const EXTENSION_CSS = '.css';
const DATA = 'data';
const NEW_LINE = '\n';

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'bundle.css');
const outputStream = fs.createWriteStream(distPath);

fsPromises.readdir(stylesPath, { withFileTypes: true})
  .then(dirents => {
    dirents.forEach( dirent => {
      if(!dirent.isDirectory()){
        const pathToFile = path.join(stylesPath, dirent.name);
        const fileInfo = path.parse(pathToFile);

        if(fileInfo.ext === EXTENSION_CSS){
          const inputStream = fs.createReadStream(pathToFile);
          inputStream.on(DATA, data => {
            outputStream.write(data.toString() + NEW_LINE);
          });
        }
      }
    }); 
  });