const request = require('supertest');
const app = require('../app.js');
const cheerio = require("cheerio");
const session = require('supertest-session');
const { generateRandomString } = require('./test.tools')
const { User } = require('../models')

const userTest = describe('User tests', () => {

  it('Should return a login page', async () => {
    const res = await request(app).get('/login');
    const stringToParse = res.text;
    const $ = cheerio.load(stringToParse);

    expect($('h2').text()).toBe('Login');
    expect(res.statusCode).toEqual(200);
  });

  it('Should return a sign up page', async () => {

    const res = await request(app).get('/');
    const stringToParse = res.text;

    const $ = cheerio.load(stringToParse);


    expect($("#name").html()).not.toBe(null)
    expect($("#email").html()).not.toBe(null)
    expect($("#password").html()).not.toBe(null)
    expect($("#passwordConf").html()).not.toBe(null)
    expect($("#accept-cgv").html()).not.toBe(null)
    expect($("#refute-retractation").html()).not.toBe(null)
    expect($("#confirmPay").html()).not.toBe(null)
    expect(res.statusCode).toEqual(200);

  });

  it('Test login user : Should return the home page', async () => {

    const testSession = session(app)
    let preAuthUser = await User.findOne({where : {name: 'FakerUser'}})

    const res = await testSession
      .post('/login')
      .send({email: preAuthUser.email, password: 'testpassword'})
      .redirects(1);

    const stringToParse = res.text;
    const $ = cheerio.load(stringToParse);

    expect(res.req.path).toEqual('/profile/objectif');
    expect(res.statusCode).toEqual(200);

  });

  it('Test login admin : should return an admin page', async () => {

    const testSession = session(app)
    const preAuthAdmin = await User.findOne({where : {name: 'FakerUserAdmin'}})

    const res = await testSession
      .post('/login')
      .send({email: preAuthAdmin.email, password: 'testpassword'})
      .redirects(1);

    const stringToParse = res.text;
    const $ = cheerio.load(stringToParse);

    expect(res.req.path).toEqual('/admin/train');
    expect($('h2').text()).toBe('Programme');
    expect(res.statusCode).toEqual(200);

  });/**/
});

module.export = userTest
