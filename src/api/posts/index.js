const Router = require('koa-router');

const posts = new Router();
const postsCtrl = require('./posts.controller');

// GET /api/posts/page/:no [ex] /api/posts/page/3
posts.get('/page/:page', postsCtrl.list);

// GET /api/posts/:name/page/:no [ex] /api/posts/임정주/page/3
posts.get('/:artist/page/:page', postsCtrl.listOfPostOfAnArtist);

// GET /api/posts/artists [ex] /api/posts/artists
posts.get('/artists', postsCtrl.listOfArtists);

// PATCH /api/posts/:id [ex] /api/posts/58432cs896651e3e74123 w/ { 'hide': 'true' }
posts.patch('/:id', postsCtrl.update);

// POST /api/posts/ [ex] /api/posts/ w/ { {"author": "임영택", "date": "2019-07-30", "targetArtist": "임정주", "targetWork": "무제", "content": "와... 정말 너무 좋은 작품이다..."}
posts.post('/', postsCtrl.create);

module.exports = posts;