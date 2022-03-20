var express = require('express');  
var bodyParser = require('body-parser');
var fileManipulator = require('./scripts/fileManipulator');
var generator = require('./scripts/generator');
 
var port = 5000;
var host = 'localhost';  
 
var app = express();
 
app.use(bodyParser.json({  
  limit: '100k',
}));
 
app.get('/', (req, res, next) => {  
  res.json({
    msg: 'you\'ve reached the server',
	possible_requests: [
		{op: 'get', path: '/logs'},
		{op: 'get', path: '/logs/:file'},
		{op: 'get', path: '/logs/:file/games'},
		{op: 'get', path: '/logs/:file/games/:game'},
	]
  });
});

app.get('/logs', (req, res, next) => {
	res.json({
		logs: fileManipulator.read.logsFolder()
	});
});

app.get('/logs/:file', (req, res, next) => {
	fileManipulator.read.gameLog('./files/logs/'+req.params.file)
		.then( logArray => {
			res.json(generator.generate.log.json(logArray));
		}).catch( error => {
			res.json({error_message: error});
		});
});

app.get('/logs/:file/games', (req, res, next) => {
	fileManipulator.read.gameLog('./files/logs/'+req.params.file)
		.then( logArray => {
			res.json(Object.keys(generator.generate.log.json(logArray)));
		}).catch( error => {
			res.json({error_message: error});
		});
});

app.get('/logs/:file/games/:game', (req, res, next) => {
	fileManipulator.read.gameLog('./files/logs/'+req.params.file)
		.then( logArray => {
			let game = generator.generate.log.json(logArray)[req.params.game];
			if (game == undefined)
				res.json({error_message: "required game does not exist on this log."});
			else
				res.json(game);
		}).catch( error => {
			res.json({error_message: error});
		});
});
 
app.listen(port, host);
 
console.log('listening on '+host+':'+port);
 
module.exports = app;
