const commandLineArgs = require('command-line-args')
const path = require("path");
const fs = require("fs");
let files = [];

const optionDefinitions = [
	{ name: 'from', alias: 'f', type: String, multiple: true },
	{ name: 'to', alias: 't', type: String },
	{ name: 'target', alias: 'd', type: String },
]

const options = commandLineArgs(optionDefinitions)

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

if (options.from === undefined || options.to === undefined || options.from instanceof Array === false || options.from.length === 0 || typeof options.to !== 'string'|| typeof options.target !== 'string') {
    throw new Error("Please enter the correct parameters.\nExample: node index.js --from js --to ts");
}

const tagetDir = path.join(process.cwd(), options.target || '.')

// Find Files
getFolderInFile(tagetDir, options.from);

// Rename Files
if (files.length > 0) {
    files.forEach(file => {
        renameFile(file, `.${options.to}`);
    });
}
