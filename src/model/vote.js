/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemSchema = require('./item').ItemSchema;

const VoteSchema = new Schema({
        voteKey: String,
        title: String,
        content: String,
        limitTime: String,
        item: [ItemSchema],
        status: String
    },
    {collection: 'vote'}
);

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;