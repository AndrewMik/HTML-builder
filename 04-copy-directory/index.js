const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const SOURCE_FOLDER = 'files';
const DESTINATION_FOLDER = 'files-copy';

function createFolder(){
  fs.mkdir(path.join(__dirname, DESTINATION_FOLDER), { recursive: true }, (err) => {
    if(err) throw err;
  });
}

function removeFiles(){
  fs.readdir(path.join(__dirname, DESTINATION_FOLDER), (err, files) => {
    if(err) throw err;
    files.forEach( file => {
      fsPromises.unlink(path.join(__dirname, DESTINATION_FOLDER, file));
    });
  });
}
  
function copyFiles(){  
  fsPromises.readdir(path.join(__dirname, SOURCE_FOLDER))
    .then(files => files.forEach( file => {
      const sourcePath = path.join(__dirname, SOURCE_FOLDER, file);
      const destinationPath = path.join(__dirname, DESTINATION_FOLDER, file);
  
      fsPromises.copyFile(sourcePath, destinationPath);
    }));
}  

createFolder();
removeFiles();
copyFiles();
