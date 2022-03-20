var fs = require('fs');
var Promise = require('promise');

module.exports = {
    read: {
		gameLog: logPath => {
			return new Promise((success, failure) => {
				let dotSplit = logPath.split('.');
				if ( !dotSplit[dotSplit.length - 1] == 'log' )
					failure("File asked is not a .log file.")
				fs.readFile(logPath, 'utf8', (err, fileContent) => {
					if (err)
						failure("An error occurred while reading the file.");
					else
						success(fileContent.split(/[\r\n]+/));
				});
			});
		},
		logsFolder: () => {
			return fs.readdirSync('./files/logs');
		}
    }
};
