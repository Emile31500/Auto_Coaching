const express = require('express');

const app = express();
<<<<<<< Updated upstream
=======
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
var router = express.Router();
>>>>>>> Stashed changes

const { sequelize } = require('./models'); 
const { User } = require('./models/');


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})