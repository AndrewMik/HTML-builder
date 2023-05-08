const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const WELCOME_PHRASE = 'Hello! Please enter your text...\n';
const GOODBYE_PHRASE = 'Take care!';
const EXIT = 'exit';
const DATA = 'data';
const SIGINT = 'SIGINT';
const OUTPUT_FILE_NAME = 'text.txt';

const output = fs.createWriteStream(path.join(__dirname, OUTPUT_FILE_NAME));

function exitHandler(){
  process.stdout.write(GOODBYE_PHRASE);
  exit();
}

process.stdout.write(WELCOME_PHRASE);

process.stdin.on(DATA, data => {
  if(data.toString().trim() === EXIT) {
    exitHandler();
  }
  output.write(data);
});

process.on(SIGINT, exitHandler);