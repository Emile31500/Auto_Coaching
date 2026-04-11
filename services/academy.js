const { Curse, Session,  SessionBibliography, SessionBibliographyDraft } = require('../models');

const publishCurseDraft = async (curseDraft) => {
    try { 
        const curseOrNull = await Curse.findOne({
            include : [{
                model : Session,
                include :  {
                    model : SessionBibliography
                }
            }],   
            where : {
            curseDraftId : curseDraft.id,
        }})


        if (curseOrNull instanceof Curse) {
            curse = curseOrNull
        } else {
            curse = await Curse.create({
                curseDraftId : curseDraft.id,
            })
        }

        curse.libele=curseDraft.libele;
        curse.description=curseDraft.description;
        curse.imageUrl=curseDraft.imageUrl;
        curse.dependantCurseId=curseDraft.dependantCurseDraftId;
        curse.isDeleted=null;
        await curse.save();

        curseDraft.SessionDrafts.forEach(async(sessionDraft) => {

            const sessionOrNull = await Session.findOne({
                where : {
                    sessionDraftId : sessionDraft.id
                }
            })
            

            if (sessionOrNull instanceof Session) {
                session = sessionOrNull
            } else {
                session = await Session.create({
                    sessionDraftId : sessionDraft.id,
                    curseId : curse.id,
                })
            }

            session.libele = sessionDraft.libele,
            session.description = sessionDraft.description,
            session.ordering = sessionDraft.ordering,
            session.videoUrl = sessionDraft.videoUrl,
            session.curseId = curse.id,
            session.isDeleted = null
            await session.save()

            sessionDraft.SessionBibliographyDrafts.forEach(async (sessionBibliographyDraft) => {

                const sessionBibliographyOrNull = await SessionBibliography.findOne({
                    where : {
                    sessionBibliographyDraftId : sessionBibliographyDraft.id,
                }})
                
                if (sessionBibliographyOrNull instanceof SessionBibliographyDraft) {
                    sessionBibliography = sessionBibliographyOrNull
                } else {
                    sessionBibliography = await SessionBibliography.create({
                        sessionId : session.id,
                        sessionBibliographyDraftId : sessionBibliographyDraft.id,
                    })
                }
                sessionBibliographyDraft.libele = sessionBibliographyDraft.libele
                sessionBibliography.url = sessionBibliographyDraft.url
                sessionBibliography.isDeleted = null
                await sessionBibliography.save()
            })/**/
        })

        return curse;


    } catch (error) {

        console.log(error)
        return error.message
    }
    

};

module.exports = {
  publishCurseDraft
};