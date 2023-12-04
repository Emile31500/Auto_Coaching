const express = require('express');
const router = express.Router()
var parserJson = require('../middlewares/parserJson');

var authenticationChecker = require('../middlewares/authenticationChecker');
var adminChecker = require('../middlewares/adminChecker')

var layout = require('express-ejs-layouts');
const { User } = require('../models');
const pbkdf2 = require("hash-password-pbkdf2")
const url = require('url');

router.get('/profile', authenticationChecker, (req, res) => {

    const user = req.user;

    res.render('../views/profile',  { user: user, layout: '../views/main' });

})


router.get('/login', async function(req, res, next) {

 //   res.render('../views/login',  { layout: '../views/main' });
    res.render('../views/login',  { error: false, layout: '../views/main' });


});
  
router.get('/signup', function(req, res, next) {

    res.render('../views/signup',  { layout: '../views/main' });

});

router.post('/sign', async (req, res) => {

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

router.get('/api/user', adminChecker, parserJson, async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.query.id;

    const user = await User.findOne({where: {id: id}});

    if (user) {

        res.statusCode = 200
        res.send({'code': res.statusCode, 'message': 'The user has been found', 'data': user});
        
    } else {

        res.statusCode = 404
        res.send({'code': res.statusCode, 'message': 'The user hasn\'t been found'});
    }

});

router.patch('/api/users', authenticationChecker, async (req, res) => {

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
                    'code':201,
                    'message':'user created',
                    'data': user
                });

    } else {

        res.statusCode = 400;
        res.json({'code': res.statusCode, 'message':'The user couldn\'t be edited', 'data': user});

    }

});

router.post('/login', parserJson, async (req, res, next) => {

    if (req.body){

        user = await User.findOne({where:  {email: req.body.email}});

        if (user) {

            if (pbkdf2.validateSync(req.body.password, user.password)) {

                const authToken = await user.getAuthenticationToken();
                req.session.token = authToken;

                if (user.role.includes('admin')){

                    res.redirect('/admin/train/request')

                } else {

                    res.redirect('/');

                }
            
            } else {
            
                res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });
            
            }

        } else {

            res.render('../views/login',  { error: true, message: "Incorrect password or login", layout: '../views/main' });

        }
    }
});
  
 module.exports = router