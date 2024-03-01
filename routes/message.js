const express = require('express');
const { User, Message, sequelize } = require('../models/')
const { Op , QueryTypes, literal } = require('sequelize');
const authenticationChecker = require('../middlewares/authenticationChecker')
const premiumChecker = require('../middlewares/premiumChecker');

const router = express.Router();


router.get('/message', authenticationChecker, premiumChecker,  (req, res) => {

    res.render('../views/message',  { layout: '../views/main' });

});

router.get('/api/message', authenticationChecker, premiumChecker, async (req, res) => {

    const admin = await User.findOne({
         where : literal(`JSON_CONTAINS(role, '["admin"]')`)
    });

    const message = await Message.findAll({
            where : {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { userId : req.user.id },
                            { userIdRecipient : admin.id}
                        ], 
                    },
                    {
                        [Op.and]: [
                            { userId : admin.id },
                            { userIdRecipient : req.user.id}
                        ], 
                    }
                ],
                isDelated : false 
            }
        });


    if (message) {

        res.statusCode = 200;
        res.send({code : res.statusCode, message : 'Messages has been successfully found', data : message});

    } else {

        res.statusCode = 404;
        res.send({code : res.statusCode, message : 'Messages has not been found'});

    }
});

router.post('/api/message', authenticationChecker, premiumChecker,  async (req, res) => {

    const admin = await User.findOne({
        where : literal(`JSON_CONTAINS(role, '["admin"]')`)
    });

    const message = await sequelize.query('INSERT INTO messages(userId, isDelated, isViewed, message, userIdRecipient, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        {
        bind: [req.user.id, false, false, req.body.message, admin.id, req.body.createdAt, req.body.updatedAt],
        type: QueryTypes.INSERT
        }
    );

    if (message) {

        res.statusCode = 201;
        res.send({code : res.statusCode, message : 'The message has been successfully sent', data : message});


    } else {

        res.statusCode = 400;
        res.send({code : res.statusCode, message : 'The message can\t be sent for a unknow reason'});

    }

});


module.exports = router;
