#!/usr/bin/env node

/*
 * (C) 2015 Seth Lakowske
 */

var spawn    = require('child_process').spawn;
var url      = require('url');
var register = require('./').register;
var remove   = require('./').remove;

console.log(process.argv);

var connectOptions = {}
if (process.argv.length > 6) {
    var serviceDirectory = process.argv[2];
    console.log(serviceDirectory);
    connectOptions = url.parse(serviceDirectory);
    var serviceName = process.argv[3];
    var hostName = process.argv[4];
    var port     = process.argv[5];
    console.log(serviceName);
    var usedArgs = process.argv.splice(0, 6);

    console.log(usedArgs);
    console.log(process.argv);
    register(connectOptions, serviceName, hostName, port, {}, function() {
        var service = spawn('node', process.argv);
        service.on('close', function() {
            remove(connectOptions, serviceName, function() {
                console.log('process died and removed service');
            })
        })
    });

} else {
    console.log('Usage: register-service <service directory URL> <service name> <script path> [[[port] args ] ... ]');
}
    