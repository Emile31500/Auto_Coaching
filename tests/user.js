const request = require('supertest')
const should = require('should');
const { JSDOM } = require('jsdom')
const { User } = require('../models')
const express = require('express');
const app = require('../app')
const session = require('supertest-session');

function generateRandomString(length) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


const userTest = describe('User tests', () => {

  it('Should return a login page', async () => {

    const res = await request(app).get('/login');
    const stringToParse = res.text;

    const parsedString =  new JSDOM(stringToParse);
    const DOM = parsedString.window.document;

    expect(DOM.querySelector('h2').innerHTML).toBe('Login');
    expect(DOM.querySelector('.alert')).toEqual(null);
    expect(res.statusCode).toEqual(200);

  });

  it('Should return a sign up page', async () => {

    const res = await request(app).get('/signup');
    const stringToParse = res.text;

    const parsedString =  new JSDOM(stringToParse);
    const DOM = parsedString.window.document;

    expect(DOM.querySelector('h2').innerHTML).toBe('Sign up');
    expect(DOM.querySelector('.alert')).toEqual(null);
    expect(res.statusCode).toEqual(200);

  });

  it('Should return the login page', async () => {

    const randomString = generateRandomString(10)

    const res = await request(app)
      .post('/sign')
      .redirects(1)
      .send({name: 'Nouvel utilisateur', email: randomString + '@gmail.com', password: 'P4$$w0rd'});

    expect(res.req.path).toEqual('/login');
    expect(res.statusCode).toEqual(200);

  });
  
  it('Should return the home page', async () => {

    let preAuthUser = await User.findOne({where : {email: 'emile00013+2@gmail.com'}})

    const resA = await request(app)
      .post('/login')
      .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'});

    expect(resA.req.path).toEqual('/login');
    expect(resA.statusCode).toEqual(302);

    let postAuthUser = await User.findOne({where : {email: 'emile00013+2@gmail.com'}})

    
    expect(preAuthUser.authToken).not.toEqual(postAuthUser.authToken);
    expect(preAuthUser.authToken).not.toBeUndefined();
  });

  it('Should return the home page', async () => {

    const testSession = session(app)

    const res = await testSession
      .post('/login')
      .send({email: 'emile00013+2@gmail.com', password: 'P4$$w0rd'})
      .redirects(1);

    const stringToParse = res.text;

    const parsedString =  new JSDOM(stringToParse);
    const DOM = parsedString.window.document;

    expect(res.req.path).toEqual('/');
    expect(res.statusCode).toEqual(200);
    expect(DOM.querySelector('h1').innerHTML).toBe('Auto Coaching');
    expect(DOM.querySelector('h2').innerHTML).toBe('Welcome to Child Template');
    expect(DOM.querySelector('.alert')).toEqual(null);
    expect(res.statusCode).toEqual(200);

  });

});

module.exports = userTest
