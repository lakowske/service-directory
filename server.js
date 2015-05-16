/*
 * (C) 2015 Seth Lakowske
 */

var fs               = require('fs');
var serviceDirectory = require('./');

if(!process.argv[2]) {
    console.log('Usage: node server.js <port> [directoryFile]');
} else {
    var port = parseInt(process.argv[2], 10);
}

var directoryFile = "directory.json";
if (process.argv[3]) {
    directoryFile = process.argv[3];
}

var directory = {}
if (fs.existsSync(directoryFile)) {
    directory = JSON.parse(fs.readFileSync(directoryFile));
}

serviceDirectory.server(directoryFile, directory).listen(port);
