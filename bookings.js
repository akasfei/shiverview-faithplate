module.exports = [
  {
    url: '/bookings',
    method: 'get',
    handler: function (req, res, srv) {
      if (typeof req.query.id === 'undefined')
        return res.status(404).send();
      var query = {event: req.query.id};
      if (req.query.me !== 'undefined' && req.session.user !== 'undefined')
        query.user = req.session.user.name;
      srv.db.find(query, 'bookings', {})
      .then(function (docs) {
        res.send(docs);
      }, function (err) {
        next(err);
      });
    }
  },
  {
    url: '/bookings',
    method: 'put',
    handler: function (req, res, srv) {
      if (typeof req.session.user === 'undefined')
        return res.status(401).send();
      if (typeof req.body.id === 'undefined')
        return res.status(404).send();
      var payload = {event: req.body.id, user: req.session.user.name};
      srv.db.insert(payload, 'bookings', {})
      .then(function () {
        res.send();
      }, function (err) {
        next(err);
      });
    }
  },
  {
    url: '/bookings',
    method: 'delete',
    handler: function (req, res, srv) {
      if (typeof req.session.user === 'undefined')
        return res.status(401).send();
      if (typeof req.query.id === 'undefined')
        return res.status(404).send();
      var query = {event: req.query.id, user: req.session.user.name};
      srv.db.remove(query, 'bookings', {})
      .then(function () {
        res.send();
      }, function (err) {
        next(err);
      });
    }
  }
];