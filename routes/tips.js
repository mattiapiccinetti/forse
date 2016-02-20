var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = process.env.DATABASE_URL;
var superMegaSecretTip = process.env.SUPER_MEGA_SECRET_TIP;

router.get('/tips/random', function (req, res) {
  pg.connect(conString, function (err, client, done) {
    if (err) { return console.error('error fetching client from pool', err); }

    client.query('select * from tips', function (err, result) {
      done();
      if (err) { return console.error(err); }
      res.send(result.rows[Math.floor(Math.random() * result.rows.length)])
    });
  });
});

router.get('/tips/:id(\\d+)', function (req, res) {
  pg.connect(conString, function (err, client, done) {
    if (err) { return console.error('error fetching client from pool', err); }

    client.query('select * from tips where id = $1', [req.params.id], function (err, result) {
      done();
      if (err) { return console.error(err); }
      res.send(result.rows[0]);
    });
  });
});

router.get('/tips', function (req, res) {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({ message: 'forse non sei autorizzato' });
  }

  pg.connect(conString, function (err, client, done) {
    if (err) { return console.error('error fetching client from pool', err); }

    client.query('select * from tips order by id asc', function (err, result) {
      done();
      if (err) { return console.error(err); }
      res.send(result.rows);
    });
  });
});

router.post('/tips', function (req, res) {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({ message: 'forse non sei autorizzato' });
  }

  pg.connect(conString, function (err, client, done) {
    if (err) { return console.error('error fetching client from pool', err); }

    client.query('insert into tips(tip) values($1)', [req.body.tip], function (err, result) {
      done();
      if (err) { return console.error(err); }
      res.status(201).json({ message: 'tip inserito forse con successo' });
    });
  });
});

router.put('/tips/:id(\\d+)', function (req, res) {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({ message: 'forse non sei autorizzato' });
  }

  pg.connect(conString, function (err, client, done) {
    if (err) { return console.error('error fetching client from pool', err); }
    
    client.query('update tips set tip = $1, created_at = now() where id = $2', [req.body.tip, req.params.id], function (err, result) {
      done();
      if (err) { return console.error(err); }
      res.json({ message: 'tip aggiornato forse con successo' });
    });
  });
});

module.exports = router;