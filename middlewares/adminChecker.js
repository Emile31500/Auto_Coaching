const jwt = require('jsonwebtoken');
const { User } = require('../models');
const session = require('express-session');

const adminChecker = async function (req, res, next) {
    try {

        const authToken = req.session.token;
        const decodeToken = jwt.verify(authToken, process.env.JWT_SECRET);
            
        if (!decodeToken) throw new Error
        
        const user = await User.findOne({where: {'email': decodeToken.email}});

        
        if(!user) {
        
            throw new Error
        
        } else if (user.role.includes('admin') == false) {

            throw new Error

        } else {

            req.user = user;
            next();

        }
        
    } catch (e) {
  
        res.redirect('/');
  
    }
}

module.exports = adminChecker;