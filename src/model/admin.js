/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
        username: String,
        password: String,
        salt: String,
        key: String
    },
    {collection: 'Vote'}
);

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;