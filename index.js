/*
 * (C) 2015 Seth Lakowske
 */

var fs         = require('fs');
var http       = require('http');
var methods    = require('http-methods');
var JSONStream = require('JSONStream');

/*
 * Create a service directory server.
 *
 * @param {String} directoryFile where service information is persisted.
 * @param {Object} directory object to store service information.
 */
function server(directoryFile, directory) {
    var handler = methods({

        GET: function(req, res, opts, cb) {
            if (req.url === '/version') res.end('0.0.1');

            res.end(JSON.stringify(directory));
        },

        POST: function(req, res, opts, cb) {
            var jsonStream = JSONStream.parse();
            req.pipe(jsonStream);
            jsonStream.on('data', function(service) {
                console.log('got service ' + JSON.stringify(service));
                directory[service.name] = service;
                fs.writeFileSync(directoryFile, JSON.stringify(directory));
            })
            req.on('end', function() {
                res.end();
            });

        },

        DELETE: function(req, res, opts, cb) {
            delete directory[req.headers.service];
            fs.writeFileSync(directoryFile, JSON.stringify(directory));
            res.end();
        }

    });

    return http.createServer(function(req, res) {

        handler.call(this, req, res, {}, function(err) {console.log(err)});

    });
}

/*
 * Connect to the service directory server
 *
 * @param {Object} serverOpts used to make the http request to the server
 * @param {String} name the name of the service being registered
 * @param {String} hostname of the service being registered
 * @param {String} port of the service being registered
 * @param {Object} options to record with the service being registered
 * @param {Function} callback made when registered or an error if there was a problem.
 */
function register(serverOpts, name, hostname, port, options, callback) {
    serverOpts.method = 'POST';

    var req = http.request(serverOpts, function(res) {
        if (res.statusCode === 200) {
            callback(null);
            console.log('registered');
        } else {
            callback('error registering service');
        }
    })

    options.hostname = hostname;
    options.port     = port;
    options.name     = name;

    req.write(JSON.stringify(options));
    req.end();
}

function lookup(serverOpts, name, callback) {
    serverOpts.method = 'GET';

    var req = http.request(serverOpts, function(res) {
        var jsonStream = JSONStream.parse();
        res.pipe(jsonStream);
        jsonStream.on('data', function(service) {
            callback(service);
        })
    })

    req.end();
}


module.exports.server   = server;
module.exports.register = register;
module.exports.lookup   = lookup;
