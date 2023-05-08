const fs = require('fs');
const path = require('path');

const SOURCE_FILE_NAME = 'text.txt';
const UNICODE = 'utf-8';

const readStream = fs.createReadStream(path.join(__dirname, SOURCE_FILE_NAME), UNICODE);

readStream.on('data', data => console.log(data));