const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const DISTRIBUTION_FOLDER_NAME = 'project-dist';

const STYLES = 'styles';
const ASSETS = 'assets';
const COMPONENTS = 'components';

const DATA = 'data';

const HTML_SOURCE = 'template.html';
const HTML_FILE = 'index.html';
const CSS_FILE = 'style.css';
const HTML_EXTENSION = '.html';
const CSS_EXTENSION = '.css';
const UNICODE = 'utf-8';
const NEW_LINE = '\n';

const STYLES_FOLDER = path.join(__dirname, STYLES);
const COMPONENTS_FOLDER = path.join(__dirname, COMPONENTS);
const DISTRIBUTION_FOLDER = path.join(__dirname, DISTRIBUTION_FOLDER_NAME);
const ASSETS_SOURCE_FOLDER = path.join(__dirname, ASSETS);
const ASSETS_DISTRIBUTION_FOLDER = path.join(__dirname, DISTRIBUTION_FOLDER_NAME, ASSETS);

const HTML_TEMPLATE_PATH = path.join(__dirname, HTML_SOURCE);
const HTML_DISTRIBUTION_FILE = path.join(__dirname, DISTRIBUTION_FOLDER_NAME, HTML_FILE);
const STYLES_DISTRIBUTION_FILE = path.join(__dirname, DISTRIBUTION_FOLDER_NAME, CSS_FILE);

function createFolder(pathToFolder){
  fs.mkdir(pathToFolder, { recursive: true }, (err) => {
    if(err) throw err;
  });
}

function assembleHTML(){
  const inputStream = fs.createReadStream(HTML_TEMPLATE_PATH, UNICODE);
  const outputStream = fs.createWriteStream(HTML_DISTRIBUTION_FILE);
  const templates = {};
  
  fsPromises.readdir(COMPONENTS_FOLDER, { withFileTypes: true})
    .then(dirents => {
      dirents.forEach( (dirent, index) => {
        const template = `{{${dirent.name.replace(HTML_EXTENSION, '')}}}`;
        const readStream = fs.createReadStream(path.join(COMPONENTS_FOLDER, dirent.name), UNICODE);
        readStream.on(DATA, templateData => {
          templates[template] = templateData;
          if(index === dirents.length - 1){
            inputStream.on(DATA, data => {
              for (const template in templates) {
                data = data.replace(template, templates[template]);
              }
              outputStream.write(data);
            });
          }
        });   
      });
    });
}

function assembleStyles(){
  const outputStream = fs.createWriteStream(STYLES_DISTRIBUTION_FILE);

  fsPromises.readdir(STYLES_FOLDER, { withFileTypes: true})
    .then(dirents => {
      dirents.forEach( dirent => {
        if(!dirent.isDirectory()){
          const pathToFile = path.join(STYLES_FOLDER, dirent.name);
          const fileInfo = path.parse(pathToFile);
  
          if(fileInfo.ext === CSS_EXTENSION){
            const inputStream = fs.createReadStream(pathToFile);
            inputStream.on(DATA, data => {
              outputStream.write(data.toString() + NEW_LINE);
            });
          }
        }
      }); 
    });
}

function copyFiles(folderToCopy, destinationFolder){  
  fsPromises.readdir(folderToCopy, { withFileTypes: true})
    .then(dirents => dirents.forEach( dirent => {
      const sourcePathToDirent = path.join(folderToCopy, dirent.name);
      const destinationPath = path.join(destinationFolder, dirent.name);
      if(dirent.isDirectory()){
        createFolder(path.join(destinationFolder, dirent.name));
        copyFiles(sourcePathToDirent, destinationPath);
      } else {
        fsPromises.copyFile(sourcePathToDirent, destinationPath);
      }
    }));
}

fs.rm(DISTRIBUTION_FOLDER, { recursive: true, force: true }, () => {
  createFolder(DISTRIBUTION_FOLDER);
  assembleHTML();
  assembleStyles();
  createFolder(ASSETS_DISTRIBUTION_FOLDER);
  copyFiles(ASSETS_SOURCE_FOLDER, ASSETS_DISTRIBUTION_FOLDER);
});