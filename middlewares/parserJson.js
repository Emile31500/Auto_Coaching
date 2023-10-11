const bodyParser = require('body-parser');


const parserJson = async function (req, res, next) {
    bodyParser.urlencoded({ extended: false });
}

module.exports = parserJson;