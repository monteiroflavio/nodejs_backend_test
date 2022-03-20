var chai = require('chai');
var expect = require('chai').expect;
var fs = require('fs');
var fileManipulator = require('../scripts/fileManipulator');
var parser = require('../scripts/parser');
var generator = require('../scripts/generator');

chai.use(require('chai-match'));

describe('generator.generate.game.json(gameArray)', () => {
    it('should return an object containing information of players, kills per player'
       +'\nand total kills on a game.', () => {
	   return fileManipulator.read.gameLog('./files/logs/games.log')
	       .then( log => {
				let gameTwo = parser.parse.games(log)[1];
				let result = generator.generate.game.json(gameTwo);

				expect(result).to.be.an('object');
				expect(result).to.have.a.property("total_kills");
				expect(result).to.have.a.property("players");
				expect(result).to.have.a.property("kills");
				expect(result.total_kills).to.equal(11);
				expect(result.kills).deep.equal({"Isgalamido": -5, "Mocinha": 0});
				expect(result.players).deep.equal(["Isgalamido", "Mocinha"]);
	       });
       });
});

describe('generator.generate.log.json(gameLog)', () => {
    it('should return an array containing objects of all games present in a log file.', () => {
	return fileManipulator.read.gameLog('./files/logs/games.log')
	    .then( log => {
			let result = generator.generate.log.json(log);
			let games = Object.keys(result);

			expect(result).to.be.an('object');
			for (let i = 0; i < games.length; i++)
				expect(games[i]).to.match(/^game_\d+/);
	    });
    });
});
