var expect = require('chai').expect;
var fileManipulator = require('../scripts/fileManipulator');
var parser = require('../scripts/parser');

describe('parser.parse.games(logArray)', () => {
    it('should return an array which each element is a game existing in the log.', () => {
	return fileManipulator.read.gameLog('./files/logs/games.log')
	    .then( log => {
			let result = parser.parse.games(log);
			expect(result).to.be.an('array');
			expect(result.length).to.equal(21);
	    });
    });
});

describe('parser.parse.client.ids(gameArray)', () => {
    it('should return an array containing all client ids found on a given game.', () => {
	return fileManipulator.read.gameLog('./files/logs/games.log')
	    .then( log => {
			let gameTwo = parser.parse.games(log)[1];
			let result = parser.parse.client.ids(gameTwo);
			expect(result).to.be.an('array');
			expect(result).deep.equal([2,3]);
	    });
    });
});

describe('parser.parse.client.userInfo(gameArray, clientId, clientUserInfo)', () => {
	it('should return an object containing the information from an\n'
		+'ClientUserinfoChanged log element of a given client id.', () => {
		let infoLine = '21:17 ClientUserinfoChanged: 2 n\\Isgalamido\\t\\0\\'
			+'model\\uriel\/zael\\hmodel\\uriel\/zael\\g_redteam\\\\g_blueteam\\'
			+'\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
		let result = parser.parse.client.userInfo(infoLine, 2, {});
		expect(result).to.be.an('object');
		expect(result.n).to.equal('Isgalamido');
		expect(result.t).to.equal('0');
		expect(result.model).to.equal('uriel/zael');
		expect(result.hmodel).to.equal('uriel/zael');
		expect(result.g_redteam).to.equal('');
		expect(result.g_blueteam).to.equal('');
		expect(result.c1).to.equal('5');
		expect(result.c2).to.equal('5');
		expect(result.hc).to.equal('100');
		expect(result.w).to.equal('0');
		expect(result.l).to.equal('0');
		expect(result.tt).to.equal('0');
		expect(result.tl).to.equal('0');
	});

	it('should return the same clientUserInfo passed as parameter.', () => {
		let infoLine = '21:17 ClientUserinfoChanged: 2 n\\Isgalamido\\t\\0\\'
			+'model\\uriel\/zael\\hmodel\\uriel\/zael\\g_redteam\\\\g_blueteam\\'
			+'\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
		let result = parser.parse.client.userInfo(infoLine, 3, {});
		expect(result).to.be.an('object');
		expect(result).deep.equal({});
	});
});

describe('parser.parse.client.kills(gameArray, clientId, clientUserInfo)', () => {
	it('should return an object which is updated with kill information available\n'
		+'from a Kill log element of a given client id.', () => {
	   	let infoLine = '22:06 Kill: 2 3 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH'
			+' by MOD_TRIGGER_HURT';
		let result = parser.parse.client.kills(infoLine, 2, {
	    	kills: 0, world_deaths: 0
	   	});
		expect(result).to.be.an('object');
		expect(result.kills).to.equal(1);
		expect(result.world_deaths).to.equal(0);
	});

	it('should return the same clientUserInfo passed as parameter.', () => {
	   	let infoLine = '22:06 Kill: 2 3 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH'
			+' by MOD_TRIGGER_HURT';
		let result = parser.parse.client.kills(infoLine, 3, {
	    	kills: 0, world_deaths: 0
	   	});
		expect(result).to.be.an('object');
		expect(result).deep.equal({ kills: 0, world_deaths: 0 });
	});

	it('should return an object which is updated with death information available\n'
		+'from a Kill log element of a given client id.', () => {
	   	let infoLine = ' 21:07 Kill: 1022 2 22: <world> killed Isgalamido'
			+' by MOD_TRIGGER_HURT';
		let result = parser.parse.client.kills(infoLine, 2, {
	    	kills: 0, world_deaths: 0
	   	});
		expect(result).to.be.an('object');
		expect(result.kills).to.equal(0);
		expect(result.world_deaths).to.equal(1);
	});

	it('should return the same clientUserInfo passed as parameter.', () => {
	   	let infoLine = ' 21:07 Kill: 1022 2 22: <world> killed Isgalamido'
			+' by MOD_TRIGGER_HURT';
		let result = parser.parse.client.kills(infoLine, 3, {
	    	kills: 0, world_deaths: 0
	   	});
		expect(result).to.be.an('object');
		expect(result).deep.equal({ kills: 0, world_deaths: 0 });
	});
});

describe('parser.parse.client.activities(gameArray, clientId)', () => {
	it('should return an array containing each user connection on for a given client id.\n'
		+'this object should contain the last user change information provided before a\n'
       	+'disconnection or the end of the game. It also should contain a counter for the\n'
       	+'number of kills realized by that player, and the number of deaths for the world.', () => {
	   	return fileManipulator.read.gameLog('./files/logs/games.log')
			.then( log => {
		   		let gameTwo = parser.parse.games(log)[1];
				let result = parser.parse.client.activities(gameTwo, 2);
				expect(result).to.be.an('array');

				expect(result[0].kills).to.equal(0);
				expect(result[0].world_deaths).to.equal(2);
				expect(result[0].n).to.equal('Isgalamido');
				expect(result[0].t).to.equal('0');
				expect(result[0].model).to.equal('uriel/zael');
				expect(result[0].hmodel).to.equal('uriel/zael');
				expect(result[0].g_redteam).to.equal('');
				expect(result[0].g_blueteam).to.equal('');
				expect(result[0].c1).to.equal('5');
				expect(result[0].c2).to.equal('5');
				expect(result[0].hc).to.equal('100');
				expect(result[0].w).to.equal('0');
				expect(result[0].l).to.equal('0');
				expect(result[0].tt).to.equal('0');
				expect(result[0].tl).to.equal('0');

				expect(result[1].kills).to.equal(3);
				expect(result[1].world_deaths).to.equal(6);
				expect(result[1].n).to.equal('Isgalamido');
				expect(result[1].t).to.equal('0');
				expect(result[1].model).to.equal('uriel/zael');
				expect(result[1].hmodel).to.equal('uriel/zael');
				expect(result[1].g_redteam).to.equal('');
				expect(result[1].g_blueteam).to.equal('');
				expect(result[1].c1).to.equal('5');
				expect(result[1].c2).to.equal('5');
				expect(result[1].hc).to.equal('100');
				expect(result[1].w).to.equal('0');
				expect(result[1].l).to.equal('0');
				expect(result[1].tt).to.equal('0');
				expect(result[1].tl).to.equal('0');
	       });
       });
});
