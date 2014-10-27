var crypto = require('crypto');

module.exports = [
  {
    url: '/events',
    method: 'get',
    handler: function (req, res, srv) {
      var query = {};
      var options = {};
      if (req.query.l)
        options.limit = req.query.l;
      if (req.query.t)
        query.title = {$test: {$search: req.query.t}};
      if (req.query.c)
        query.creator = req.query.c;
      srv.db.find(query, 'events', options)
      .then(function (docs) {
        res.send(docs);
      }, function (err) {
        res.send(err);
      });
    }
  },
  {
    url: '/events',
    method: 'put',
    handler: function (req, res, srv) {
      if (typeof req.session.user === 'undefined')
        return res.status(401).send();
      var payload = {};
      for (var prop in req.body)
        payload[prop] = req.body[prop]
      payload.creator = req.session.user.name;
      srv.db.insert(payload, 'events', {})
      .then(function () {
        res.send();
      }, function (err) {
        res.send(err);
      });
    }
  },
  {
    url: '/events',
    method: 'post',
    handler: function (req, res, srv) {
      if (typeof req.session.user === 'undefined')
        return res.status(401).send();
      var _id = new srv.db.util.ObjectID(req.body._id);
      srv.db.find({_id: _id}, 'events', {})
      .then(function (docs) {
        if (docs.length < 1)
          return res.status(404).send();
        if (!req.session.user.admin && req.session.user.name !== docs[0].title)
          return res.status(403).send();
        delete req.body._id;
        srv.db.update({_id: _id}, {$set: req.body}, 'events', {})
        .then(function () {
          res.send();
        }, function (err) {
          res.send(err);
        });
      }, function (err) {
        res.send(err);
      });
    }
  },
  {
    url: '/events',
    method: 'delete',
    handler: function (req, res, srv) {
      if (typeof req.session.user === 'undefined')
        return res.status(401).send();
      var _id = new srv.db.util.ObjectID(req.query._id);
      srv.db.find({_id: _id}, 'events', {})
      .then(function (docs) {
        if (docs.length < 1)
          return res.status(404).send();
        if (!req.session.user.admin && req.session.user.name !== docs[0].title)
          return res.status(403).send();
        srv.db.remove({_id: _id}, 'events', {})
        .then(function () {
          res.send();
        }, function (err) {
          res.send(err);
        });
      }, function (err) {
        res.send(err);
      });
    }
  },
];
