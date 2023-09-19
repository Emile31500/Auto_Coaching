const express = require('express');
const sequelize = require('db.js');
// Use these variables in your application

const app = express();

// Your Express.js application code here

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
