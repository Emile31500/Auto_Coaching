const express = require('express');

const app = express();

const { sequelize } = require('./models'); 
const { User } = require('./models/');


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});