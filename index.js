const path = require("path");
const fs = require("fs");
let files = [];

function getFolderInFile(directory, fileTypes) {
    fs.readdirSync(directory).forEach(file => {
        const absolute = path.join(directory, file);

        if (fs.statSync(absolute).isDirectory()) {
            return getFolderInFile(absolute, fileTypes);
        } else {
            let splitPath = absolute.split('/');
            let splitFileName = splitPath[splitPath.length - 1].split('.');

            if (fileTypes.includes(splitFileName[splitFileName.length - 1])) {
                return files.push(absolute);
            }
        }
    });
}

function renameFile(file, format, newName = null) {
    let splitFileName = file.split('.');
    let fileName = (newName != null ? newName : splitFileName[0]);

    fs.rename(file, fileName+format, function(err) {
        if (err) {
            console.log('ERROR: ' + err);
        }
    });
}

// Find Files
getFolderInFile("./", ['html', 'css', 'scss', 'ipa']);

// Rename Files
if (files.length > 0) {
    files.forEach(file => {
        renameFile(file, '.js');
    });
}