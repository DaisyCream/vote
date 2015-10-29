/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const csrf = require('koa-csrf');
const session = require('koa-session');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const app = koa();

const signController = require('./controller/sign');
const voteController = require('./controller/vote');

render(app, {
    root: path.join(__dirname, './view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

router.get('/login', function *(next) {
    yield this.render('login', {title: 'login', csrf: this.csrf});
});

router.post('/login', function *(next) {
    yield signController.login.call(this);
});

const check = function *(next) {
    var back = yield signController.check.call(this);
    if (back) {
        yield next;
    } else {
        this.body = '';
        return;
    }
};

router.get('/clgxtmain', check, function *(next) {
    yield voteController.fn.call(this);
});

router.post('/vote/add', check, function *(next) {
    yield voteController.vote.call(this);
});

router.post('/option/add', check, function *(next) {
    yield voteController.option.call(this);
});

router.post('/vote/change', check, function *(next) {

});

router.get('/vote/:key', check, function *(next) {
    if (this.params.key == 'all') {
        yield voteController.getVoteAll.call(this);
    } else {
        yield voteController.getVote.call(this);
    }
});

router.get('/v/:key', function *(next) {
    yield voteController.userWindow.call(this);
});

router.get('/v/c/:key', function *(next) {
    var cb = yield voteController.check.call(this);
    if (cb) {
        yield next;
    } else {
        this.status = 500;
    }
}, function *(next) {
    yield voteController.uservote.call(this);
});

router.get('/v/w', function *(next) {
    yield voteController.useroauth.call(this);
});

router.post('/v/:key', function *(next) {
    yield voteController.check.call(this);
});

app.keys = ['session secret'];
app.use(function *(next) {
    this.weixinScope = {};
    yield next;
});
app.use(session(app));
csrf(app);
app.use(bodyParser());
app.use(serve(__dirname + '/../public'));
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.server.port);

