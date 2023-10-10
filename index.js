const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv').config();


const app = express();

const { sequelize } = require('./models'); 
const { User } = require('./models/');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const pbkdf2 = require("hash-password-pbkdf2")
var router = express.Router();

app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with a secret key for session encryption
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json());


app.post('/users/create/', async (req, res) => {

  let data;

  if (data = req.body){

    const hashedPassword = pbkdf2.hashSync(data.password);
    
    const newUser = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    const authToken = await newUser.authJWT();
    req.session.token = authToken;

    res.statusCode = 201
    res.redirect('auth-requi');

  } else {

    res.statusCode = 400;
    res.json({"status" : 400});

  }

});

app.post('/login', async (req, res, next) => {

  let data;

  if (data = req.body){

    user = await User.findOne( {where:  {email: data.email}});

    if (pbkdf2.validateSync(data.password, user.password)) {

      const authToken = jwt.sign({ __id: user.id }, process.env.JWT_SECRET);
      user.authToken = authToken;
      await user.save();
      
      //const authToken = await user.authJWT();
      req.session.token = authToken;
      res.redirect('auth-requi');

    } else {
      
      res.render('login');
    
    }
  }
});


const authentication = async function (req, res, next) {

  try {

    const authToken = req.session.token;
    console.log(authToken);
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    
    if (!decodedToken) throw new Error

    const user = await User.findOne({where: {'authToken': authToken}});
    
    if(!user) throw new Error

    next();
  } catch (e) {

    res.status(401).send('Vos mères c\'est des dinosaures');

  }

}

app.get('/auth-requi', authentication, function (req, res, next) {

  res.send({'key': 'value'});

});


app.get('/login', function(req, res, next) {

  res.render('login');

});

app.get('/signup', function(req, res, next) {
  res.render('signup');
});