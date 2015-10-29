/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
var formidable = require('formidable');
var multipart = require('co-multipart');
var proxy = require('../proxy');
var fs = require('fs');
var OAuth = require('wechat-oauth');
var client = new OAuth('your appid', 'your secret');

exports.fn = function *() {
    yield this.render('main', {title: 'main'});
};

exports.option = function *() {
    if (this.query.type == 'just') {
        var content = this.request.body.content;
        var key = proxy.addOption('none', content);
        if (key) {
            this.body = {key: key, picPath: 'none'};
        } else {
            this.status = 500;
        }
    } else {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = __dirname + "/../../public/images";
        var cb = yield new Promise(resolve=> {
            form.parse(this.req, function (err, fileds, files) {
                resolve({
                    err, fileds, files
                });
            });
        });
        if (cb.err) {
            this.status = 500;
        } else {
            var content = cb.fileds.content;
            var picPath = cb.files.file.path.split('/').pop();
            var key = proxy.addOption(picPath, content);
            if (key) {
                this.body = {key, picPath};
            } else {
                this.status = 500;
            }
        }
    }
};

exports.vote = function *() {
    var data = JSON.parse(this.request.body.data);
    var cb = yield proxy.addVote(data);
    if (cb) {
        this.body = '';
    } else {
        this.status = 500;
    }
};

exports.getVoteAll = function *() {
    var cb = yield proxy.getVoteAll();
    if (cb) {
        this.body = cb;
    } else {
        this.status = 500;
    }
};

exports.getVote = function *() {
    var cb = yield proxy.getVote(this.params.key);
    if (cb) {
        this.body = cb;
    } else {
        this.status = 500;
    }
};

exports.userWindow = function *() {
    var cb = yield proxy.getVote(this.params.key);
    if (cb) {
        var data = cb[0];
        yield this.render('vote', {title: data.title, data});
    } else {
        yield this.render('error', {title: 'Sorry', error: '对不起没有此投票哦~'});
    }
};

exports.check = function *() {
    var cb = yield proxy.getVote(this.params.key);
    var r = false;
    if (cb) {
        var data = cb[0];
        var flag = true;
        try {
            if (this.request.body.data) {
                var vote = new Array(JSON.parse(this.request.body.data));
            } else {
                var vote = new Array(JSON.parse(this.query.data));
                r = true;
            }
        } catch (e) {
            this.status = 500;
        }
        vote[0].forEach((v, index)=> {
            var total = 0;
            v.forEach(t=> {
                if (t == 1) {
                    total++;
                }
            });
            if (total > data.item[index].limit || total == 0) {
                flag = false;
            }
        });
        if (flag == false) {
            this.body = {msg: "选择数量错误"};
            this.status = 500;
        } else {
            if (r) {
                return true;
            }
            this.session['pass'] = true;
            this.body = {msg: "/v/c/" + data.voteKey}
        }
    } else {
        this.body = {msg: "服务异常"};
        this.status = 500;
    }
};


exports.uservote = function *() {
    var url = client.getAuthorizeURL('redirectUrl', 'state', 'snsapi_userinfo');
    this.redirect(url);
};

exports.useroauth = function *() {
    client.getUser('openid', function (err, result) {
        var userInfo = result;
    });
};