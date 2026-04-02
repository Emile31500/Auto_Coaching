const express = require('express');
const { Curse, SessionBibliography, Session, ViewedCurse, ViewedSession } = require('../models')
const router = express.Router()
const authenticationChecker = require('../middlewares/authenticationChecker');

var parserJson = require('../middlewares/parserJson');
const { Op, where, literal } = require('sequelize');


const multer  = require('multer');
const premiumChecker = require('../middlewares/premiumChecker');
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
const finalName = 'curse-image-' + uniqueSuffix;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/photo/');
    },
    filename: function (req, file, cb) {
        cb(null, finalName);
    }
})


router.get('/academy', authenticationChecker, premiumChecker, async (req, res) => {

    curses = await Curse.findAll({
        include : [{
            model : Session
        }, {
            model : ViewedCurse,
            where : {
                userId : req.user?.id || 1
            },
            required : false,
        }],
        where : {
            isDeleted : {
                [Op.not] : true
            }
        }

    })

    const viewedCurses = await ViewedCurse.findAll({where : {
        userId : req.user?.id || 1
    }})

    const viewedCursesMapped = viewedCurses.map((viewedCurse) => viewedCurse.Curse);

    res.locals.message = req.flash();
    res.render('../views/academy/index',  { 
        user : req.user, 
        viewedCurses : viewedCurses,
        viewedCursesMapped : viewedCursesMapped,
        isAdmin : false,
        page : '/academy',
        layout: '../views/main' 
    });
})

router.get('/curse/:idC/session/:idS', authenticationChecker, premiumChecker, async (req, res) => {

    const idC = req.params.idC
    const idS = req.params.idS


    const curseOrNull = await Curse.findOne({
        include : [{
            model : Session,
            include : {
                model : ViewedSession,
                where : {
                    userId : req.user?.id || 1
                },
                required : false
            },
        }],
        where :  {
            isDeleted : null,
            id : idC
        },
        order: [[Session, 'id', 'ASC']]
    })

    const sessionOrNull  = await Session.findOne({
        include : [
            SessionBibliography,
        ],
        where :  {
            isDeleted : null,
            curseId : idC,
            id : idS
        }
    })

    if (curseOrNull instanceof Curse && sessionOrNull instanceof Session) {

        res.locals.message = req.flash();
        res.render('../views/academy/detail-curse',  { 
            user : req.user, 
            page : '/academy',
            isAdmin : false,
            curse : curseOrNull,
            session : sessionOrNull,
            layout: '../views/main' 
        });

    } else {
        res.redirect('/academy')

    }

    
})

router.post('/curse/:idC/session/:idS', authenticationChecker, premiumChecker, parserJson, async (req, res) => {

    try {

        const idC = req.params.idC
        const idS = req.params.idS
        const rawData = req.body

        const actCurse = await Curse.findOne({
                include : [{
                    model : Session,
                    where : {
                        isDeleted : null
                    },
                    include : [{
                        model : ViewedSession,
                        where : {
                            userId : req.user?.id || 1
                        }
                    }]

                    
                }],
                where :  {
                    isDeleted : null,
                    id : idC
                }
            })

        const actSession = await Session.findOne({
            include : [SessionBibliography],
            where :  {
                isDeleted : null,
                curseId : idC,
                id : idS
            }
        })

        const viewedSessionOrNull = await ViewedSession.findOne({
            userId : req.user?.id || 1,
            sessionId : actSession.id 
        })

        const nextSessionOrNull = await Session.findOne({
            where :  {
                isDeleted : null,
                id : {
                    [Op.gt] : idS
                }
            }
        })


        if (!(viewedSessionOrNull instanceof ViewedSession)) {
            
            if (rawData.isThisSessionViewed) {

                const viewedSession = await ViewedSession.create({
                    sessionId : actSession.id,
                    userId : req.user?.id || 1
                })

                req.flash('success', `Vous avez terminé la partie "${actSession.libele}" du cours "${actCurse.libele}"`)
            }
        } else {

            req.flash('warning', `Le cours "${actSession.libele}" est déjà terminé."`)

        }

        areAllCursesRead = true;
        actCurse.Sessions.forEach(session => {areAllCursesRead = areAllCursesRead && (session.ViewedSessions.length > 0)})

        if (areAllCursesRead) {

            const viewedCurseOrNull = await ViewedCurse.findOne({ userId : req.user?.id || 1, curseId : actCurse.id});

            if (!(viewedCurseOrNull instanceof ViewedCurse)) {
                await ViewedCurse.create({
                    curseId : actCurse.id,
                    userId : req.user?.id || 1
                })
            }

        } else {

            await ViewedCurse.delete({where : {
                userId : req.user?.id || 1,
                curseId : actCurse.id
            }})

        }
        

        if (nextSessionOrNull instanceof Session){

            res.redirect(`/curse/${actCurse.id}/session/${nextSessionOrNull.id}`) 

        } else {

            res.redirect(`/academy`)

        }
    
    } catch (error) {

        console.log(error)
        req.flash('danger', error.message)
        res.redirect(`/academy`)

    }
})

module.exports = router