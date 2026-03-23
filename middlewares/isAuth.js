const jwt = require('jsonwebtoken');
const { User } = require('../models/');
const session = require('express-session');

const isAuth =  async function (req, res, next) {
        
    try {
        
        const decodeToken = jwt.verify(authToken, process.env.JWT_SECRET);
               
        if (!decodeToken) throw new Error
    
        const user = await User.findOne({where: {'email': decodeToken.email}});
      
        if(!user) {
        
            throw new Error
        
        } else {

            req.user = user;

        }
        
    } catch (e) {

        req.user = false;
  
    }

    next();

}

module.exports = isAuth;
