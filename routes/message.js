const express = require('express');
const { User, Message, sequelize } = require('../models/')
const { Op , QueryTypes, literal } = require('sequelize');
const authenticationChecker = require('../middlewares/authenticationChecker')
const authenticationCheckerApi = require('../middlewares/authenticationCheckerApi')

var parserJson = require('../middlewares/parserJson');
const adminCheckerApi = require('../middlewares/adminCheckerApi')
const adminChecker = require('../middlewares/adminChecker')


const premiumChecker = require('../middlewares/premiumChecker');

const router = express.Router();


router.get('/message', authenticationChecker, premiumChecker, (req, res) => {

    res.render('../views/message',  { layout: '../views/main' });

});

router.get('/admin/message', adminChecker, async (req, res) => {

    const users = await User.findAll({
        where : literal(`JSON_CONTAINS(role, '["user"]') AND NOT(JSON_CONTAINS(role, '["admin"]'))`)
    });

    res.render('../views/admin/message-list',  { users : users, layout: '../views/main-admin' });

});

router.get('/admin/message/:id_user', adminCheckerApi, parserJson, (req, res) => {

    const idRecipient = req.params.id_user

    res.render('../views/admin/message-detail',  { idRecipient : idRecipient, layout: '../views/main-admin' });

});

router.get('/api/admin/message/:id_user/since/:since_date', adminCheckerApi, parserJson, async (req, res) => {


    const idRecipient = req.params.id_user
    const sinceDate = req.params.since_date

    const message = await Message.findAll({
        where : {
            [Op.or]: [
                {
                    [Op.and]: [
                        { userId : req.user.id },
                        { userIdRecipient : idRecipient}
                    ], 
                },
                {
                    [Op.and]: [
                        { userId : idRecipient },
                        { userIdRecipient : req.user.id}
                    ], 
                }
            ],
            isDelated : false, 
            createdAt : { 
                [Op.gt] : new Date(sinceDate)
            }
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

router.post('/api/admin/message/:id_user', adminCheckerApi, async (req, res) => {

    const idRecipient = req.params.id_user

    const message = await sequelize.query('INSERT INTO messages(userId, isDelated, isViewed, message, userIdRecipient, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        {
        bind: [req.user.id, false, false, req.body.message, idRecipient, req.body.createdAt, req.body.updatedAt],
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

router.get('/api/message/:since_date', authenticationCheckerApi, premiumChecker, parserJson, async (req, res) => {

    const since_date = req.params.since_date;

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
                isDelated : false,
                createdAt : { 
                    [Op.gt] : new Date(since_date)
                }
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

router.post('/api/message', authenticationCheckerApi, premiumChecker,  async (req, res) => {

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
