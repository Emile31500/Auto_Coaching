
const express = require('express');

const app = express();

const { sequelize } = require('./models'); 
const { User } = require('./models/');
const pbkdf2 = require("hash-password-pbkdf2")
const bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

var LocalStrategy = require('passport-local').Strategy



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use(bodyParser.json());

app.post('/users', async (req, res) => {
  let data;

  if (data = req.body){

    const hashedPassword = pbkdf2.hashSync(data.password);

    const newUser = User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

      res.statusCode = 201
      res.json({"status" : 201})

  } else {

    res.statusCode = 400;
    res.json({"status" : 400});

  }

});


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { email: username } });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isPasswordOk = pbkdf2.validateSync(password, user.password); 

      if (isPasswordOk) {
        return done(null, user); 
      } else {
        return done(null, false, { message: 'Incorrect password' }); 
      }
    } catch (error) {
      
      return done(error); 
    }
  }
));


app.use(passport.initialize());
app.use(passport.session()); 
app.use(session({
  secret: 'IYFhgfdddupMMIOUbhbvgCFDCDFRFGVGFddEREdfDDErFcfdZegrypNHukgfxdYUuINpkpoGTitrDUnjPpItuifViuHBJUgdeysZ6EEZ2ZsEQRXFDVGHJhgkiIJNuiHx',
  resave: false,
  saveUninitialized: false,
}));

app.post('/login', async (req, res, next) => {
  try {

    await passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);

  } catch (error) {

    console.error('Authentication error:', error);

  }
});
