var logfmt = require('logfmt');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var pg = require('pg');
var app = express();

var conString = process.env.DATABASE_URL;
var superMegaSecretTip = process.env.SUPER_MEGA_SECRET_TIP;

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('port', (process.env.PORT || 5000));
app.set('view engine', '.hbs');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(app.get('port'), function() {
  console.log('Forse server is listening on port', app.get('port'));
});

app.get('/', function(req, res) {
	res.render('layouts/index', { 
		apiEndpoint : req.protocol + '://' + req.headers.host + '/api/tips/random',
		defaultTip : 'forse non funziona'
	});
});

app.get('/api/tips/random', function(req, res) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('select * from tips', function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      res.send(result.rows[Math.floor(Math.random() * result.rows.length)])
    });
  });
});

app.get('/api/tips/:id(\\d+)', function(req, res) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}
	  
	  client.query('select * from tips where id = $1', [req.params.id], function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      res.send(result.rows[0]);
    });
  });
});

app.get('/api/tips', function(req, res) {
	if (req.query.secret != superMegaSecretTip) {
		return res.status(401).json({ message: 'forse non sei autorizzato' });
	}
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('select * from tips order by id asc', function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      res.send(result.rows);
    });
  });
});

app.post('/api/tips', function(req, res) {
	if (req.query.secret != superMegaSecretTip) {
		return res.status(401).json({ message: 'forse non sei autorizzato' });
	}

	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('insert into tips(tip) values($1)', [req.body.tip], function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      res.status(201).json({ message: 'tip inserito forse con successo' });
    });
  });
});

app.put('/api/tips/:id(\\d+)', function(req, res) {
	if (req.query.secret != superMegaSecretTip) {
		return res.status(401).json({ message: 'forse non sei autorizzato' });
	}

	pg.connect(conString, function(err, client, done) {
		if(err) {
    	return console.error('error fetching client from pool', err);
  	}

	  client.query('update tips set tip = $1, created_at = now() where id = $2', [req.body.tip, req.params.id], function(err, result) {
	  	done();
	  	
	  	if(err) {
	    	return console.error(err);
	    }

      res.json({ message: 'tip aggiornato forse con successo' });
    });
  });
});