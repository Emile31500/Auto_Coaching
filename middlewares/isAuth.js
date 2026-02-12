const jwt = require('jsonwebtoken');
const { User } = require('../models/');
const session = require('express-session');

const isAuth =  async function (req, res, next) {
        
    try {
        
        const authToken = req.session.token;
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
      
        if (!decodedToken) throw new Error
  
        const user = await User.findOne({where: {'authToken': authToken}});
      
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
