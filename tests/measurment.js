const { Measurment, User, NutritionRequirement } = require('../models')
const app = require('../app')
const session = require('supertest-session');
const cheerio = require("cheerio");
const { randomInt, authUser, authPremiumUser, authNonPremiumUser } = require('./test.tools')

const MeasurmentTest = describe('Measurments tests', () => {
    const today = new Date()

    const rawData = {
        weight: randomInt(),
        size: randomInt(200),
        date : today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
    }

    it (' 0 : Should return 401 error because not auth', async() => {

        const testSession = session(app);

        const res = await testSession
            .post('/measurment')
            .send(rawData)
            .redirects(1);

        const nullOrMeasurment = await Measurment.findOne({ 
            where : {
                weight : rawData.weight,
                size : rawData.size,
                date : rawData.date,
                userId : null
        }});
        expect(res.req.path).toEqual('/')
        expect(nullOrMeasurment).not.toBeInstanceOf(Measurment)

    });

    it (' 1.1 : create measurment auth non premium : should redirect to premium', async() => {
       
        const [testSession, user] = await authNonPremiumUser();

        const res = await testSession
            .post('/measurment')
            .send(rawData)
            .redirects(1);

        const nullOrMeasurment = await Measurment.findOne({ 
            where : {
                weight : rawData.weight,
                size : rawData.size,
                date : rawData.date,
                userId : user.id
        }});

        expect(res.req.path).toEqual('/premium')
        expect(nullOrMeasurment).not.toBeInstanceOf(Measurment)
    });
/*
    it (' 1.2 : create measurment auth premium : should create measurment', async() => {

       
        const [testSession, user] = await authPremiumUser();

        const res = await testSession
            .get('/profile/progression')
            .redirects(1);
            
        const stringToParse = res.text;
        const $ = cheerio.load(stringToParse);
        const url = $('form').attr('action');
        expect($('input[name="size"]').html()).not.toEqual(null)
        expect(typeof $('input[name="size"]').html()).toEqual('string')

        expect($('input[name="weight"]').html()).not.toEqual(null)
        expect(typeof $('input[name="weight"]').html()).toEqual('string')

        expect($('input[type="date"][name="date"]').html()).not.toEqual(null)
        expect(typeof $('input[type="date"][name="date"]').html()).toEqual('string')

        const resSubmition = await testSession
            .post(url)
            .send(rawData)
            .redirects(1);

        const $$ = cheerio.load(resSubmition.text);
        const nullOrMeasurment = await Measurment.findOne({
            weight : rawData.weight,
            size : rawData.size,
            date : rawData.date,
            userId : null
        });

        expect(measurmentOrNull).toBeInstanceOf(Measurment)
        expect(resSubmition.req.path).toEqual('/profile/progression');
        expect($$('.alert-success').html()).toMatch('Votre nouvelle progression a bien été enregistré avec succès !');

    });*/


    it (' 2 : create measurment auth premium with too big wieght loose : should create measurment and increas nutrition requirement', async() => {
       
        const [testSession, user] = await authPremiumUser();
       
        const measurment = await Measurment.findOne({ 
            order : [
                ['date', 'DESC']
            ],
            where : {
                userId : user.id
            }
        });

        const nutritionRequirementBefore = await NutritionRequirement.findOne({
            where : {
                userId : user.id
            }
        });

        const personnalMultiplicatorBefore = nutritionRequirementBefore.personnalMultiplicator;
        const origininalDate = new Date(measurment.date);
        const date = new Date(origininalDate.getTime() + 9 * 24 * 60 * 60 * 1000); 

        const contextRawData = {
                size : measurment.size,
                weight : measurment.weight-1,
                date : date
            }

        const res = await testSession
            .post('/measurment')
            .send(contextRawData)
            .redirects(1);
        
        const nutritionRequirementAfter = await NutritionRequirement.findOne({
            where : {
                userId : user.id
            }
        });

        const personnalMultiplicatorAfter = nutritionRequirementAfter.personnalMultiplicator;


        const $ = cheerio.load(res.text);
        const measurmentOrNull = await Measurment.findOne({ where : {
            size : contextRawData.size,
            weight : contextRawData.weight,
            date : contextRawData.date,
            userId : user.id
        }});

        expect(measurmentOrNull).toBeInstanceOf(Measurment)
        expect(res.req.path).toEqual('/profile/progression');
        expect(personnalMultiplicatorAfter).toBeGreaterThan(personnalMultiplicatorBefore)
        expect($('.alert-success').html()).toMatch('Votre nouvelle progression a bien été enregistré avec succès !');/**/
        expect($('.alert-danger').html()).toEqual(null);/**/


    });

});

module.exports = MeasurmentTest;
