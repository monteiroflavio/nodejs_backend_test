var chai = require('chai');
var expect = require('chai').expect;
var app = require('../index');

chai.use(require('chai-http'));

describe('get /', () => {
	it('should return a greeting message', () => {
		return chai.request(app)
		    .get('/')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body.msg).to.be.an('string');
				expect(res.body.possible_requests).to.be.an('array');
		    });
    });
});

describe('get /logs', () => {
	it('should return a list of files on logs folder', () => {
		return chai.request(app)
		    .get('/logs')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body.logs).to.be.an('array');
		    });
    });
});

describe('get /logs/:file', () => {
	it('should return a json which summarizes information from games of a log file', () => {
		return chai.request(app)
		    .get('/logs/games.log')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
		    });
    });

	it('should return a json which has an error message when asked file is not found.', () => {
		return chai.request(app)
		    .get('/logs/ames.log')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error_message');
		    });
    });
});

describe('get /logs/:file/games', () => {
	it('should return an array which each element is game name from a log file', () => {
		return chai.request(app)
		    .get('/logs/games.log/games')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('array');
		    });
    });

	it('should return a json which has an error message when asked file is not found.', () => {
		return chai.request(app)
		    .get('/logs/ames.log/games')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error_message');
		    });
    });
});

describe('get /logs/:file/games/:game', () => {
	it('should return an object which summarizes information of a game from a log file', () => {
		return chai.request(app)
		    .get('/logs/games.log/games/game_21')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
		    });
    });

	it('should return a json which has an error message when asked file is not found.', () => {
		return chai.request(app)
		    .get('/logs/ames.log/games/game_21')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error_message');
		    });
    });

	it('should return a json which has an error message when asked game is not found.', () => {
		return chai.request(app)
		    .get('/logs/games.log/games/game_22')
		    .then( res => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('error_message');
		    });
    });
});
