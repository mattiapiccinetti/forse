var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('layouts/index', {
      title: 'forse',
      apiEndpoint: req.protocol + '://' + req.headers.host + '/api/tips/random',
      defaultTip: 'forse non funziona'
    });
});

module.exports = router;