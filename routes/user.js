const express = require('express');
const router = express.Router()
const parserJson = require('../middlewares/parserJson');
var layout = require('express-ejs-layouts');


router.get('/profile', (req, res) => {

    res.render('../views/profile',  { layout: '../views/main' });

})


router.get('/login', function(req, res, next) {

    res.render('../views/login',  { layout: false });

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

router.post('/login', parserJson, async (req, res, next) => {

if (req.body){

    
    user = await User.findOne({where:  {email: req.body.email}});

    if (pbkdf2.validateSync(req.body.password, user.password)) {

    const authToken = await user.getAuthenticationToken();
    req.session.token = authToken;
    res.redirect('/home');


    } else {
    
    res.render('../views/login');
    
    }
}
});
  
 module.exports = router