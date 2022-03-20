var Promise = require('promise');
var parser = require('./parser');

function generateGameJson (gameArray) {
    let clientsIds = parser.parse.client.ids(gameArray);
    let game = {total_kills: 0, players: [], kills: {}};
    for (let i = 0; i < clientsIds.length; i++) {
		let clientsInfos = parser.parse.client.activities(gameArray, clientsIds[i]);
		for (let j = 0; j < clientsInfos.length; j++) {
		    if (game.players.indexOf(clientsInfos[j].n) == -1) {
				game.players.push(clientsInfos[j].n);
				game.kills[clientsInfos[j].n] = clientsInfos[j].kills
				    - clientsInfos[j].world_deaths;
		    }
		    else
				game.kills[clientsInfos[j].n] += clientsInfos[j].kills
					- clientsInfos[j].world_deaths;
	    	game.total_kills += clientsInfos[j].kills
				+ clientsInfos[j].world_deaths;
		}
    }
    return game;
}

function generateLogJson (gameLog) {
    let games = parser.parse.games(gameLog);
    let logJson = {};
    for (let i = 0; i < games.length; i++)
		logJson['game_'+(i+1)] = generateGameJson(games[i]);
    return logJson;
}

module.exports = {
    generate: {
		game: { json: generateGameJson },
		log: { json: generateLogJson }
    }
}
