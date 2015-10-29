/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
var Option = require('../model').Option;
var Item = require('../model').Item;
var Vote = require('../model').Vote;
var md5 = require('md5');

exports.addOption = function (picPath, content) {
    var option = new Option();
    option.content = content;
    option.imgPath = picPath;
    var key = md5(Date.now() + Math.random());
    option.optionKey = key;
    /*
     var cb = yield new Promise(resolve => {
     option.save(err=> {
     if (err) {
     resolve(false);
     } else {
     resolve(true);
     }
     });
     });*/
    return key;
};

exports.addVote = function *(data) {
    var vote = new Vote();
    vote.title = data.title;
    vote.content = data.content;
    vote.limitTime = data.hours * 3600 * 1000;
    vote.status = "未开启";
    vote.voteKey = md5(Date.now() + Math.random());
    data.item.forEach(d => {
        var item = new Item();
        item.title = d.title;
        item.limit = parseInt(d.limit);
        if (parseInt(d.limit) == 1) {
            item.method = "单选";
        } else {
            item.method = "多选";
        }
        d.option.forEach(o=> {
            var option = new Option();
            option.optionKey = o.key;
            option.content = o.content;
            option.imgPath = o.picPath;
            item.option.push(option);
        });
        vote.item.push(item);
    })
    var cb = yield new Promise(resolve=> {
        vote.save(err=> {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
    return cb;
};

exports.getVoteAll = function *() {
    var cb = yield new Promise(resolve=> {
        Vote.find().select('-item').exec((err, data)=> {
            if (err || data.length == 0) {
                resolve(false);
            } else {
                resolve(data);
            }
        });
    });
    return cb;
};

exports.getVote = function *(key) {
    var cb = yield new Promise(resolve=> {
        Vote.find({voteKey: key}).exec((err, data)=> {
            if (err || data.length == 0) {
                resolve(false);
            } else {
                resolve(data);
            }
        });
    });
    return cb;
};