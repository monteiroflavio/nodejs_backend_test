# Node.js Backend Test for LuizaLabs Challenge

This README file helps one to setup the Backend Test environment and documents functionalities developed for this challenge.

## Summary

* Setup
* Usage
* Development Documentation

## Setup

### Third-part software needed
Prior to the setup, make sure you have at least Git and Node.js installed. If you don't, please install them.

#### Git installation

If you are using a Debian-like distro, execute the following command to install Git:
```sh
    $ sudo apt install git
```
or
```sh
    $ apt install git
```
if you are logged as root.

#### Node.js installation

If you are using a Debian-like distro, execute the following command to install Node.js:

```sh
    $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    $ sudo apt install nodejs
```

### Clone the repository

Initially, create a directory under your preferred path:
```sh
    $ mkdir <FOLDER_NAME>
```

Move to the created directory:
```
    $ cd <FOLDER_NAME>
```

Under the directory, start git environment and clone the repository

```sh
    $ git init
    $ git clone https://bitbucket.org/sarabada/test_backend.git
```

At the actual version (1.0), your directory structure after the clone should be something like:

```
    ./
        files/
            logs/
                games.log
            gamesProcessing.json
            test.txt
        scripts/
            fileManipulator.js
            generator.js
            parser.js
        test/
            testFileManipulator.js
            testGenerator.js
            testParser.js
            testServer.js
        .gitignore
        index.js
        package-lock.json
        package.json
```

### Install necessary packages

Various packages are needed to properly execute scripts, such as Express, Mocha and Promise. To install those packages, execute:

```sh
    $ npm install
```

After this step, you should be ready to go ;)

## Usage

Here, some examples of usage will be shown.

### Running the web server

To have the web server up and running, execute the following command on the terminal under the root project directory:

```sh
    $ nodejs index.js
```

If everything is ok, you should see the following message on the terminal:

```sh
    listening on localhost:5000
```

### Consuming the web server

With the web server running, the are several ways of consuming the web server in order to make tests.

Basically, you can access it from:

* Any terminal command which enables HTTP requests
* Directly from a browser
* Using a HTTP request enabler API in any programming language

#### Available URLs

Web server will respond to the following URLs, which can be tested from this document if the web server is up:

* http://localhost:5000/
* http://localhost:5000/logs
* http://localhost:5000/logs/:file
* http://localhost:5000/logs/:file/games
* http://localhost:5000/logs/:file/games/:game

Further information of their meaning will be given on the API usage section.

#### Consuming examples

Examples on how to consume these URL from terminal are (if you are on Linux and have [cURL](https://curl.haxx.se/) or [wget](https://www.gnu.org/software/wget/) installed):

```sh
    $ curl http://localhost:5000/
    $ wget http://localhost:5000/
```

If you are on your web broser, simply past the following URL on the search bar:

```
    http://localhost:5000/
```

An example on how to consume URLs will be given using JavaScript language. The package [request](https://github.com/request/request) is needed:

```js
var request = require('request');
request
  .get('http://localhost:5000/logs')
  .on('response', function(response) {
    //prints the status returned from the server
    console.log(response.statusCode);
    //prints the content-type of the response
    console.log(response.headers['content-type']);
    //prints the response itself
    console.log(response.body);
  })
```

## Development Documentation

In this section, descriptions are given for the way files are organized. For each script file, there will be a description of its functions.

### Files organization

Files are organized as follow:

```
    ./
        files/
            logs/
                games.log
            gamesProcessing.json
            test.txt
        scripts/
            fileManipulator.js
            generator.js
            parser.js
        test/
            testFileManipulator.js
            testGenerator.js
            testParser.js
            testServer.js
        .gitignore
        index.js
        package-lock.json
        package.json
```

#### /

The root project directory contains files which are needed to the instalation of packages and the `index.js`, which is the web server script.

#### files/

The `files/` directory contains general files which are not scripts, such `.json` files or `.txt` files. It is important to notice that `package.json` and `package-lock.json` are not in this directory because `npm install` command asks that these files are placed on the root project folder.

Inside `files/` directory, it is placed `logs/` directory, which is used to put all `.log` files. Scripts consume this path to find logs.

#### scripts/

`scripts/` directory is used to place general scripts. Currently, scripts located in this directory are related to file manipulation, parsing and JSON structure generating.

#### test/

The `test/` directory contains scripts related to unit tests. This nomenclature was defined due to the used unit test API restrictions, [Mocha](https://mochajs.org/).

### Scripts explanation

In general, 8 scripts were generated to the challange. Scripts are divided in testing scripts, general scripts and web server script. They are structured as follow:

* Web Server Script
    *   /index.js
* General Scripts:
    * /scripts/fileManipulator.js
    * /scripts/generator.js
    * /scripts/parser.js
* Testing Scripts:
    * /test/testFileManipulator.js
    * /test/testGenerator.js
    * /test/testParser.js
    * /test/testServer.js

The next subsections will explain the functioning of each script.

#### /index.js

Exposes a web service to the proposed challenge. Uses two pre-defined, which are:
* `host`: base URL of the requests. Currently setted as `localhost`.
* `port`: HTTP port where the web server will work. Currently setted as `5000`.

The server responds to the following requests:

##### `/`

* HTTP verb: `GET`
* Responds: A JSON containing a greeting message and available requests.

##### `/logs`

* HTTP verb: `GET`
* Responds: A JSON-like array containing a list of logs.

##### `/logs/:file`

* HTTP verb: `GET`
* Parameters:
    * `file`: A string expected to be a log file name retrieved by `/logs` call.
* Responds: A JSON structure which summarizes information available in the log, as asked by the challenge.

##### `/logs/:file/games`

* HTTP verb: `GET`
* Parameters:
    * `file`: A string expected to be a log file name retrieved by `/logs` call.
* Responds: A JSON-like array which contains a list of game names existing in a log file.

##### `/logs/:file/games/:game`

* HTTP verb: `GET`
* Parameters:
    * `file`: A string expected to be a log file name retrieved by `/logs` call.
    * `game`: A string expected to be a game name retrieved by `/logs/:file/games` call.
* Responds: A JSON summarizing information of a specific game from a given log.

#### /scripts/fileManipulator.js

Operates at hard-drive level, reading files and directories, and processing them as needed.

##### read.gameLog(logPath)

Reads a log file for a given path. Transform the log content on an array. Returns a `Promise`, which can access both success scenario or fail scenario.

* Parameters:
    * `logPath`: Path where the log file is placed.
* Returns:
    * A `Promise` function, whose positive case returns an array of lines of the read file. The negative case returns a JSON with an error message and the previous error stack.

#### /scripts/parser.js

Enables functions of log parsing, in different levels, such as game level, client level, kills of a client level and user information level. Returns JSON structured data to be manipulated by `generator.js`.

##### parse.games(logArray)

Takes a log split into lines (an `array`) as entry. Returns an `array` formed by the games found in the log. Each game is formed by an `array` of lines of that game.

* Parameters:
    * `logArray`: An `array` composed of each line of a log.
* Returns:
    * An `array` of games. Each games is itself an `array` of lines comprehended to be from that game.

##### parse.client

Under this object are placed functions which main characteristic is extract client information. A client permits a user to connect to the game. However, when the user disconnects from the game, the client continues available for new user connections. It was intended that is easier to keep track of a user actions by monitoring its related client.

##### parse.client.ids(gameArray)

Takes an `array` of lines of a games as entry. Returns different client ids found on that game.

* Parameters:
    * `gameArray`: An `array`composed of each line of a game.
* Returns:
    * An `array` of each different client id found.

##### parse.client.userInfo(gameInfoLine, clientId, clientUserInfoLine)

Verifies if a line contains chaging information of a client. Updates and returns client's latest information.

* Parameters:
    * `gameInfoLine`: A `string` containing the line to be verified.
    * `clientId`: Client's id to be verified.
    * `clientUserInfo`: An `object` with the latest user information.
* Returns:
    * `clientUserInfo` updated when the line corresponds to client user information change, or the same otherwise.

##### parse.client.kills(gameInfoLine, clientId, clientUserInfoLine)

Verifies if a line contains kills caused by a client or kills of the `<world>` on that client. Updates and returns client's latest information.

* Parameters:
    * `gameInfoLine`: A `string` containing the line to be verified.
    * `clientId`: Client's id to be verified.
    * `clientUserInfo`: An `object` with the latest user information.
* Returns:
    * `clientUserInfo` updated when the line corresponds to client kill information, or the same otherwise.

##### parse.client.activities(gameArray, clientId)

Verifies client activies on a game. A client activity is interpreted as connections of users to that client, information changed by that user, kills caused by the user or user's deaths to the `<world>`, and a user disconnection. Each user connected to the client will have his or her activies stored and returned by this function.

* Parameters:
    * `gameArray`: An `array` containing the lines of a game log to be analyzed.
    * `clientId`: A `number` which represents the id of a client to be analyzed.
* Returns:
    *  An `array` whose each element correspond to a JSON with user information, as well as its kills/deaths information gathered during his or her connection.

#### /scripts/generator.js

Responsible for generate the required JSON structure asked on the challenge. There are two functions: one to generate the JSON of a game and one to generate the JSON to a entire log.

##### generate.game.json(gameArray)

Takes an `array` of a game as entry. Forms the required JSON, containing fields:
`total_kills`, which is a `number`that sums up all kill on that game, including the ones from `<world>`; `players`, which is an `array` containing all different users located using funtions `parser.parse.client.ids` and; `parser.parse.client.activities`; `kills`, which is an `object` whose keys are player names and values are correspond to each player number of kills minus number of deaths to `<world>`.

* Parameters:
    * `gameArray`:  An `array`composed of each line of a game.
* Returns:
    * An `object` which summarizes a game information.

##### generate.log.json(logArray)

Generates a JSON object which contains all games found in a log file. Each game is itself a JSON formed by the function `generator.generate.game.json`.

* Parameters
    * An `array` composed of each line of a log.
* Returns:
    * An `object` which summarizes a log information.

#### /test/testFileManipulator.js

This script tests functionalities of file manipulating, provided by `/scripts/fileManipulator.js`. Here, it is going to be explained how each test were planned against its related function.

##### fileManipulator.read.gameLog(logPath)

Three tests were defined to this function:

* **Success case**, when the `logPath` parameter is an actual path to a log file. In this case, it was tested the type of the return, which must be an `array`, and the `length`, with respect to the number of lines, of a known log file, which must be `5307`.
* **First fail case**, when the `logPath`'s file has a type other than `.log`. In this scenario, it must be returned an error message.
* **Second fail case**, when the file provided on `logPath` parameter does not exist. In this case, an error message also must be returned.

##### fileManipulator.read.logsFolder()

To this function, only one unit test were developed. As the path to the logs' directory was defined manually (e.g. `/files/logs`), it is only verified if the return type is an `array`.

#### /test/testGenerator.js

This script tests the functionalities of generating JSONs as defined on the challenge. Each function, one to generate a JSON to a game and other to generate a JSON to the entire game, has a test, as shown below:

##### generator.generate.game.json(gameArray)

This function is tested in two ways. The first one is to verify if the needed fields are present on the resultant JSON. Needed fields are: `total_kills`, `players` and `kills`. After this verification, both type of each field and a known value (verified manually) were tested.

##### generator.generate.log.json(gameLog)

This function is tested against the verification of the return type, which must be an `object` (or a JSON), and the name of each key of this object, which should start with `game_`, followed by a number which represents that game, as such `game_1`.

#### /test/testParser.js

This script were generated to test developed parsing functions. This is clearly the most sensible part of the development, since those functions should capture correct values to compose the final JSON. As such, both data types and values for some known values are tested on the functions.

##### parser.parse.games(logArray)

It is tested the type of return of this function, which must be an `array`. Also, it was previously verified the number of games in `/files/logs/games.log`. This value, `21`, is also tested to the length o the resultant array.

##### parser.parse.client.ids(gameArray)

Tests the type of return to this function, which must be an `array`. Also, for a known game, is tested found ids. For `game_2`, ids must be `2` and `3`.

##### parser.parse.client.userInfo(gameArray, clientId, clientUserInfo)

In this tests, two scenarios were aimed to be verified:
* **Success case**, when the information line passed corresponds to the desired client. In this case, the return must be an `object` with update user information existing in that line.
* **Fail case**, when the information line does not correspond to the desire client. In this case, the returned `object` must be exactly equal to the `clientUserInfo` parameter.

##### parser.parse.client.kills(gameArray, clientId, clientUserInfo)

In this test, several scenarios were tested:
* **Success case one**, when the kill information line given contains kill informatin of the desired client. In this case, variable `kills` of `clientUserInfo` must be increased in one. The updated `clientUserInfo` must then be returned.
* **Success case two**, when the kill information line given contains death informatin of the desired client to the `<world>`. In this case, variable `world_deaths` of `clientUserInfo` must be increased in one. The updated `clientUserInfo` must then be returned.
* **Fail case one**, when the kill information line given does not contain kill informatin of the desired client. In this case, `clientUserInfo` must be returned with no alterations.
* **Fail case two**, when the kill information line given does not contain death informatin of the desired client to the `<world>`. In this case, `clientUserInfo` must be returned with no alterations.

##### parser.parse.client.activities(gameArray, clientId)

This test verifies the type of the result, which must be an `array`. It is also tested a known example of client activity, verified manually from `game_2`.

#### /test/testServer.js

This script aims to test the web server functionalities. For each `URL` which the web server responds, it is related one or more tests.

##### `/`

Tests the desired return to the `GET` HTTP request to the `/` `URL`. It is verified whether the web server response is a JSON. It is also verified if the `body` variable (which corresponds to the actual web server response) in the response is an `object` and if it contains both `msg` and `possible_requests` variables.

##### `/logs`

Tests the desired return to the `GET` HTTP request to the `/logs` `URL`. It is verified whether the `body` variable from JSON return contains the variable `logs` and if it is an `array`.

##### `/logs/:file`

To this request, two scenarios are tested:
* **Success case**, which must occurs when the `.log` file asked is found. It must return an JSON contaning an `object`, which corresponds to the summarized log on JSON structure.
* **Fail case**, when asked file is not found. It must return an JSON that within is an `object`. In this object, it must be an `error_message`.

##### `/logs/:file/games`

To this request, two scenarios are tested:
* **Success case**, which must occurs when the `.log` file asked is found. It must return an JSON contaning an `array`, which corresponds to the games' names on that log.
* **Fail case**, when asked file is not found. It must return an JSON that within is an `object`. In this object, it must be an `error_message`.

##### `/logs/:file/games/:game`

To this request, three scenarios are tested:
* **Success case**, which must occurs when the `.log` file asked is found as well as the required game. It must return an JSON contaning an `object`, which corresponds to the summarization of that game.
* **Fail case one**, when asked file is not found. It must return an JSON that within is an `object`. In this object, it must be an `error_message`.
* **Fail case two**, when asked game does not exist on the required log. It must return an JSON that within is an `object`. In this object, it must be an `error_message`.
