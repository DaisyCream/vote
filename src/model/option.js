/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
        optionKey: String,
        content: String,
        imgPath: String
    },
    {collection: 'option'}
);

const Option = mongoose.model('Option', OptionSchema);

exports.Option = Option;
exports.OptionSchema = OptionSchema;
