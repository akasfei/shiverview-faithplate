var q = require('q');
var async = require('async');
var request = require('request');

var generator = require('./user-generator.js');
var baseurl = 'http://localhost:' + (process.env.port || 80) + '/faithplate';

module.exports = {
  '/events': function (it) {
    var d = q.defer();
    it('should perform actions on events', function (Db) {
      var id;
      generator.newUser().then(function () {
        async.series([
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'PUT',
              headers: {Cookie: generator.cookie},
              form: {
                title: 'event-' + generator.hash,
                desc: 'test-event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'GET',
              headers: {Cookie: generator.cookie},
              qs: {
                t: 'event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200) {
                obj = JSON.parse(body.toString());
                if (! obj instanceof Array)
                  return callback('Array expected: ' + body.toString());
                if (obj.length < 1)
                  return callback('Event not found.');
                obj = obj[0];
                id = obj._id;
                if (obj.desc === 'test-event-' + generator.hash)
                  callback();
                else
                  callback('Event desc does not match: ' + body.toString());
              }
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'POST',
              headers: {Cookie: generator.cookie},
              form: {
                _id: id,
                desc: 'modified-test-event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'GET',
              headers: {Cookie: generator.cookie},
              qs: {
                t: 'event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200) {
                obj = JSON.parse(body.toString());
                if (! obj instanceof Array)
                  return callback('Array expected: ' + body.toString());
                if (obj.length < 1)
                  return callback('Event not found.');
                obj = obj[0];
                if (obj.desc === 'modified-test-event-' + generator.hash)
                  callback();
                else
                  callback('Event desc does not match: ' + body.toString());
              }
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'DELETE',
              headers: {Cookie: generator.cookie},
              qs: {
                _id: id
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            generator.destroy(Db).then(function () {
              callback();
            }, function (err) {
              callback(err);
            });
          }
        ], function (err) {
          if (err)
            d.reject(err);
          else
            d.resolve();
        });
      }, function (err) {
        d.reject(err);
      });
    });
    return d.promise;
  },
  '/bookings': function (it) {
    var d = q.defer();
    it('should add and delete tickets on events', function (Db) {
      var id;
      generator.newUser().then(function () {
        async.series([
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'PUT',
              headers: {Cookie: generator.cookie},
              form: {
                title: 'event-' + generator.hash,
                desc: 'test-event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/events',
              method: 'GET',
              headers: {Cookie: generator.cookie},
              qs: {
                t: 'event-' + generator.hash
              }
            }, function (err, res, body) {
              if (res.statusCode === 200) {
                obj = JSON.parse(body.toString());
                if (! obj instanceof Array)
                  return callback('Array expected: ' + body.toString());
                if (obj.length < 1)
                  return callback('Event not found.');
                obj = obj[0];
                id = obj._id;
                if (obj.desc === 'test-event-' + generator.hash)
                  callback();
                else
                  callback('Event desc does not match: ' + body.toString());
              }
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/bookings',
              method: 'PUT',
              headers: {Cookie: generator.cookie},
              form: {
                id: id
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/bookings',
              method: 'GET',
              headers: {Cookie: generator.cookie},
              qs: {
                id: id
              }
            }, function (err, res, body) {
              if (res.statusCode === 200) {
                obj = JSON.parse(body.toString());
                if (! obj instanceof Array)
                  return callback('Array expected: ' + body.toString());
                if (obj.length < 1)
                  return callback('Ticket not found.');
                callback();
              }
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            request({
              uri: baseurl + '/bookings',
              method: 'DELETE',
              headers: {Cookie: generator.cookie},
              qs: {
                id: id
              }
            }, function (err, res, body) {
              if (res.statusCode === 200)
                callback();
              else
                callback('got status code ' + res.statusCode);
            });
          },
          function (callback) {
            generator.destroy(Db).then(function () {
              callback();
            }, function (err) {
              callback(err);
            });
          }
        ], function (err) {
          if (err)
            d.reject(err);
          else
            d.resolve();
        });
      }, function (err) {
        d.reject(err);
      });
    });
    return d.promise;
  }
};
