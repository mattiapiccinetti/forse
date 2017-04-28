var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = process.env.DATABASE_URL + '?ssl=true';
var superMegaSecretTip = process.env.SUPER_MEGA_SECRET_TIP;

router.get('/tips/random', (req, res) => {
  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('select * from tips', (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.send(result.rows[Math.floor(Math.random() * result.rows.length)])
    });
  });
});

router.post('/tips/random', (req, res) => {
  console.log(req.body)
  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('select * from tips', (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.send({
        "color": "green",
        "message": result.rows[Math.floor(Math.random() * result.rows.length)].tip,
        "notify": false,
        "message_format": "text"
      })
    });
  });
});



router.get('/tips/:id(\\d+)', (req, res) => {
  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('select * from tips where id = $1', [req.params.id], (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.send(result.rows[0]);
    });
  });
});

router.get('/tips', (req, res) => {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({
      message: 'forse non sei autorizzato'
    });
  }

  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('select * from tips order by id asc', (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.send(result.rows);
    });
  });
});

router.post('/tips', (req, res) => {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({
      message: 'forse non sei autorizzato'
    });
  }

  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('insert into tips(tip) values($1)', [req.body.tip], (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.status(201).json({
        message: 'tip inserito forse con successo'
      });
    });
  });
});

router.put('/tips/:id(\\d+)', (req, res) => {
  if (req.query.secret !== superMegaSecretTip) {
    return res.status(401).json({
      message: 'forse non sei autorizzato'
    });
  }

  pg.connect(conString, (err, client, done) => {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('update tips set tip = $1, created_at = now() where id = $2', [req.body.tip, req.params.id], (err, result) => {
      done();
      if (err) {
        return console.error(err);
      }
      res.json({
        message: 'tip aggiornato forse con successo'
      });
    });
  });
});

module.exports = router;
