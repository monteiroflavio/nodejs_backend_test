var fileManipulator = require('../scripts/fileManipulator');
var expect = require('chai').expect;

describe('fileManipulator.read.gameLog(logPath)', () => {
	it('should return an array for each line of a existing log', () => {
		return fileManipulator.read.gameLog('./files/logs/games.log')
			.then( gamesArray => {
				expect(gamesArray).to.be.an('array');
				expect(gamesArray.length).to.equal(5307);
			});
	});

    it('should return an error when trying to read a file whose type is other than .log.', () => {
		return fileManipulator.read.gameLog('./files/test.txt')
			.catch( error => {
				expect(error).to.equal("File asked is not a .log file.");
			});
	});
    
	it('should return an error when trying to read a file which not exists', () => {
		return fileManipulator.read.gameLog('./files/logs/ames.log')
			.catch(error => {
				expect(error).to.equal("An error occurred while reading the file.");
			});
	});
});

describe('fileManipulator.read.logsFolder()', () => {
    it('should return an array containing all log files in a folder.', () => {
		expect(fileManipulator.read.logsFolder()).to.be.an('array');
	});
});
