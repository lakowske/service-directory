/*
 * (C) 2015 Seth Lakowske
 */

var test             = require('tape');
var freeport         = require('freeport');
var serviceDirectory = require('./');

var registerTestService = function(port, directory, cb) {
    var server = serviceDirectory.server('testDirectory.json', directory);
    server.listen(port);

    var serverOpts = {
        host : 'localhost',
        port : port
    }
    serviceDirectory.register(serverOpts, 'testService', 'localhost', 31337, {}, function() {
        cb();

    });
    return server;
}

test('registration', function(t) {
    freeport(function(er, port) {
        var directory = {}
        var server = registerTestService(port, directory, function(er) {
            t.ok(directory['testService']);
            t.end();
            server.close();
        });
    });
})

test('lookup service', function(t) {
    freeport(function(er, port) {
        var directory = {}
        var server = registerTestService(port, directory, function(er) {
            serviceDirectory.lookup({host : 'localhost',port : port}, 'testService', function(service) {
                t.ok(service);
                t.end();
                server.close();
            })
        })
    })
})
