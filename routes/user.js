const express = require('express');
const router = express.Router()
var parserJson = require('../middlewares/parserJson');
var authenticationChecker = require('../middlewares/authenticationChecker');
var layout = require('express-ejs-layouts');
const { User } = require('../models');
const pbkdf2 = require("hash-password-pbkdf2")



router.get('/profile', authenticationChecker, (req, res) => {

    const user = req.user;

    res.render('../views/profile',  { user: user, layout: '../views/main' });

})


router.get('/login', function(req, res, next) {

    res.render('../views/login',  { layout: '../views/main' });

});
  
router.get('/signup', function(req, res, next) {

    res.render('../views/signup');

});

router.post('/users/create/', async (req, res) => {

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

router.post('/api/users/update/', authenticationChecker, async (req, res) => {

    let user = req.user;

    if (data = req.body){

        const hashedPassword = pbkdf2.hashSync(data.password);
        
        user.name = data.name;
        user.email = data.email;
        user.password = hashedPassword;

        const authToken = await user.getAuthenticationToken();
        req.session.token = authToken;

        user.save();
        res.statusCode = 201;
        
        res.send({
                    "code":201,
                    "message":"user created"
                });

    } else {

        res.statusCode = 400;
        res.json({"status" : 400});

    }

});

router.post('/login', parserJson, async (req, res, next) => {

if (req.body){

    user = await User.findOne({where:  {email: req.body.email}});

        if (user) {

            if (pbkdf2.validateSync(req.body.password, user.password)) {

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;
                res.redirect('/home');
            
            } else {
            
                res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });
            
            }

        } else {

            res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });

        }
    }
});
  
 module.exports = router