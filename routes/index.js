var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  var defaultTips = Array(
    'forse non funziona',
    'forse devo cambiare billing plan',
    'forse sono le API',
    'forse devo guardare i log',
    'forse non scala',
    'forse non mi regge il carico',
    'forse devo fixare',
    'forse devi fixare e farmi una pull request',
    'forse devi riprovare più tardi',
    'forse sono cappato sul numero di richieste',
    'forse è colpa mia',
    'forse non sei tu, sono io',
    'forse ho bisogno di una pausa',
    'forse ho bisogno di prendere del tempo per me',
    'forse ho bisogno dei miei spazi',
    'forse non mi capisci',
    'forse ritorno da mia madre',
    'forse non ti merito',
    'forse mi manca la vita da singleton'
  );
  var randomTip = defaultTips[Math.floor(Math.random() * defaultTips.length)];

  res.render('layouts/index', {
    title: 'forse',
    apiEndpoint: req.protocol + '://' + req.headers.host + '/api/tips/random',
    randomTip: randomTip,
    currentYear: new Date().getFullYear()
  });
});

module.exports = router;
