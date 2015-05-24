#!/usr/bin/env node

/*
 * (C) 2015 Seth Lakowske
 */

var spawn    = require('child_process').spawn;
var url      = require('url');
var register = require('./').register;
var remove   = require('./').remove;

var connectOptions = {}
if (process.argv.length >= 8) {
    var serviceDirectory = process.argv[2];
    connectOptions = url.parse(serviceDirectory);
    var serviceName = process.argv[3];
    var hostName = process.argv[4];
    var port     = process.argv[5];

    function shutdown() {
        remove(connectOptions, serviceName, function() {
            console.log('process died and removed service');
            process.exit();
        })
    }

    console.log('registering ' + serviceName + ' with ' + serviceDirectory);
    var usedArgs = process.argv.splice(0, 6);
    console.log(usedArgs);
    console.log(process.argv);

    register(connectOptions, serviceName, hostName, port, {}, function() {
        var service = spawn('node', process.argv);
        service.on('close', shutdown);
    });

    process.on('SIGINT', shutdown);

} else {
    console.log('Usage: register-service <service directory URL> <service name> <service URL> <script path> [[[port] args ] ... ]');
}
