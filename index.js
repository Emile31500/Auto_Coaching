const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv').config();

const app = express();
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const pbkdf2 = require("hash-password-pbkdf2")
var router = express.Router();

const { sequelize } = require('./models'); 
const { User } = require('./models');
const authenticationChecker = require('./middlewares/authenticationChecker');



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/home', function(req, res, next) {

  res.render('home');

});


app.get('/login', function(req, res, next) {

  res.render('login');

});

app.get('/signup', function(req, res, next) {

  res.render('signup');

});

app.post('/users/create/', async (req, res) => {

  let data;

  if (data = req.body){

    const hashedPassword = pbkdf2.hashSync(data.password);
    
    const user = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    const authToken = await user.getAuthenticationToken();
    req.session.token = authToken;

    res.statusCode = 201
    res.redirect('auth-requi');

  } else {

    res.statusCode = 400;
    res.json({"status" : 400});

  }

});

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/login', async (req, res, next) => {

  console.log(req.body);
  if (req.body){

    
    user = await User.findOne({where:  {email: req.body.email}});

    if (pbkdf2.validateSync(req.body.password, user.password)) {
  
      const authToken = await user.getAuthenticationToken();
      req.session.token = authToken;
      res.redirect('/home');


    } else {
      
      res.render('login');
    
    }
  }
});

app.get('/auth-requi', authenticationChecker, function (req, res, next) {

  res.send({'key': 'value'});

});
