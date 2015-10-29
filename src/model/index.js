/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const mongoose = require('mongoose');
const config = require('../config');
const vote = require('./vote');
const item = require('./item').Item;
const user = require('./user');
const option = require('./option');

mongoose.connect(config.db.url, err=> {
    if (err) {
        console.log(err);
    }
});

exports.Vote = mongoose.model('Vote');
exports.Item = mongoose.model('Item');
exports.User = mongoose.model('User');
exports.Option = mongoose.model('Option');