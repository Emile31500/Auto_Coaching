const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv').config();

const app = express();
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
var router = express.Router();

const { sequelize } = require('./models');
var layout = require('express-ejs-layouts');

const home = require('./routes/home')
const train = require('./routes/train')
const nutrition = require('./routes/nutrition')
const user = require('./routes/user')
const food = require('./routes/food')
const foodAte = require('./routes/foodate');
const performance = require('./routes/performance');
const measurment = require('./routes/measurment')
const exercise = require('./routes/exercise')


const authenticationChecker = require('./middlewares/authenticationChecker');

const { User } = require('./models');
const pbkdf2 = require("hash-password-pbkdf2");

app.set('view engine', 'ejs');
app.use(layout);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use(exercise);
app.use(home);
app.use(food);
app.use(foodAte);
app.use(measurment);
app.use(nutrition);
app.use(performance);
app.use(train);
app.use(user);

app.listen(3000, async () => {
  
  console.log('Server is running on port 3000');

});
