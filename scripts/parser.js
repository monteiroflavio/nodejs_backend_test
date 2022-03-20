function parseGames (logArray) {
    let gamesArray = [];
    let currentGame = [];
    for (let i = 0; i < logArray.length; i++) {
		if (!logArray[i].match(/\d*\d:\d\d\s-+/)){
		    currentGame.push(logArray[i]);
		    if (logArray[i].match(/\d*\d:\d\d\sShutdownGame:/)
				|| (logArray[i+1] != undefined
				    && logArray[i+1].match(/\d*\d:\d\d\s-+/))) {
				gamesArray.push(currentGame);
				currentGame = [];
		    }
		}
    }
    return gamesArray;
}

function parseClientIds (gameArray) {
    clients = [];
    for(let i = 0; i < gameArray.length; i++) {
		if (gameArray[i].match(/\d*\d:\d\d\sClientConnect:\s\d+/)) {
		    clientExists = false;
		    clientId = parseInt(gameArray[i].trim().split(' ')[2]);
		    for (let j = 0; j < clients.length; j++)
				if(clients[j] == clientId)
				    clientExists = true;
		    if (!clientExists)
				clients.push(clientId);
		}
    }
    return clients;
}

function parseClientUserInfo (gameInfoLine, clientId, clientUserInfo) {
    if(gameInfoLine.match(
		new RegExp("\\d*\\d:\\d\\d\\sClientUserinfoChanged:\\s"
		   +clientId))) {
		let clientUserInfoArray = gameInfoLine
		    .replace(new RegExp("\\d*\\d:\\d\\d\\sClientUserinfoChanged:\\s"
				+clientId+"\\s"), '')
		    .trim()
		    .split('\\');
		for(let i = 0; i < clientUserInfoArray.length; i+=2)
		    clientUserInfo[clientUserInfoArray[i]] = clientUserInfoArray[i+1]
    }
    return clientUserInfo;
}

function parseClientKills (gameInfoLine, clientId, clientUserInfo) {
    if (gameInfoLine.match(
		new RegExp("\\d*\\d:\\d\\d\\sKill:\\s"+clientId)))
		clientUserInfo.kills++;
    else if (gameInfoLine.match(
		new RegExp("\\d*\\d:\\d\\d\\sKill:\\s1022\\s"
		   +clientId)))
		clientUserInfo.world_deaths++;
    return clientUserInfo;
}

function parseClientActivities (gameArray, clientId) {
    let clientConnections = [];
    for(let i = 0; i < gameArray.length; i++) {
		let l = i;
		let clientUserInfo = {kills: 0, world_deaths: 0};
		while (l < gameArray.length) {
		    if (gameArray[l].match(
				new RegExp("\\d*\\d:\\d\\d\\sClientDisconnect:\\s"
				   +clientId)))
				break;
		    parseClientUserInfo(gameArray[l], clientId, clientUserInfo);
		    parseClientKills(gameArray[l], clientId, clientUserInfo);
		    l++;
		}
		i = l;
		if (!(JSON.stringify(clientUserInfo)
		      == JSON.stringify({kills: 0, world_deaths: 0})))
		    clientConnections.push(clientUserInfo);
 	}
    return clientConnections;
}

module.exports = {
    parse: {
		games: parseGames,
		client: {
		    ids: parseClientIds,
		    userInfo: parseClientUserInfo,
		    kills: parseClientKills,
		    activities: parseClientActivities
		}
    }
}
