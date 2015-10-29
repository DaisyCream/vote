/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const optionSchema = require('./option').OptionSchema;

const ItemSchema = new Schema({
        method: String,
        limit: Number,
        title: String,
        option: [optionSchema]
    },
    {collection: 'item'}
);

const Item = mongoose.model('Item', ItemSchema);

exports.Item = Item;
exports.ItemSchema = ItemSchema;