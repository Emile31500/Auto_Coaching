const jwt = require('jsonwebtoken');
const { User } = require('../models/');
const session = require('express-session');

const authenticationChecker = async function (req, res, next) {
    try {
        
        const authToken = req.session.token;
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
      
        if (!decodedToken) throw new Error
  
        const user = await User.findOne({where: {'authToken': authToken}});
      
        if(!user) {
        
            throw new Error
        
        } else {

            req.user = user;
            next();

        }
        
    } catch (e) {
  
        res.statusCode = 401;
        res.render('../views/error/error', {layout: '../views/main', code : res.statusCode, message : "Vous devez être authentifié pour accéder à cette page."});
  
    }
}

module.exports = authenticationChecker;