const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.controller');

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/logout', authCtrl.logout);
auth.get('/userinfo', authCtrl.getUserInfo);

module.exports = auth;