const app = require('../app')
const testSession = session(app)

async function auth(json){

    const authReq = await testSession
    .post('/login')
    .send({email: json.email, password: json.password})
    .redirects(1);
  
  expect(authReq.statusCode).toBe(200)

};

module.exports = auth;