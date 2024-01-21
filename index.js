const hjson = require('hjson');
const fs = require('fs');
const path = require('path');

const dir = path.dirname(process.execPath);

let log = ""

const loging = (text) => {
  log = log + "\n" + text;
  fs.writeFileSync(path.join(dir,'log.txt'), log);
}

const hjson2json = (hjsonFilePath) => {
  let data = fs.readFileSync(hjsonFilePath, 'utf8')
  try {
    const jsonFilePath = hjsonFilePath.replace('.hjson', '.json');
    // Parse the HJSON content
    const jsonData = hjson.parse(data);

    // Convert the parsed data to JSON format
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Write the JSON content to the output file
    fs.writeFileSync(jsonFilePath, jsonString, 'utf8');
  } catch (parseError) {
    loging('Error parsing HJSON:' + toString(parseError));
  }
}

const getHjsonFiles = (d = null) => {
  if (d === null) {
    d = dir
  }
  let files = fs.readdirSync(d)
  // Iterate through the list of files
  files.forEach((file) => {

    // Get the full path of each file
    const filePath = path.join(d, file);
    // Check if it's a file (not a directory)
    let stats = fs.statSync(filePath)
    if (stats != undefined) {
      if (stats.isFile()) {
        if (file.endsWith('.hjson')) {
          hjson2json(filePath)
        }
      } else if (stats.isDirectory()) {
        getHjsonFiles(filePath)
      }
    }
  });
}

getHjsonFiles()