require('dotenv').config(); // .env
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

const { jwtMiddleware } = require('./lib/token');

const indexHtml = fs.readFileSync(path.resolve(__dirname, '../client/index.html'), { encoding: 'utf8' });

mongoose.Promise = global.Promise; // will use Node Native Pormise
// connect to mongodb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(
    (response) => {
        console.log('Succesfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});

const port = process.env.PORT || 4000; // If a value of PORT is null, use 4000

app.use(bodyParser()); // 라우터 use 보다 위에 있어야 함
app.use(jwtMiddleware); // 역시 라우터 use 위에
router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.use(serve(path.resolve(__dirname, '../client/')));

app.listen(port, () => {
    console.log('Server is listening to port ' + port);
});