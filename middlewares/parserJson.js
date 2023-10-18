const bodyParser = require('body-parser');

var parserJson = bodyParser.urlencoded({ extended: false });

module.exports = parserJson;