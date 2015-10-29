/**
 * @page
 * @module
 * @author Rube
 * @date 15/10/29
 * @desc
 */

'use strict';
const md5 = require('md5');
const defaultUsername = 'admin123456';
const defaultPassword = 'clgxtadmin111111';
const defaultSalt = 'clgxt';
const defaultCookie = md5(md5(defaultUsername) + md5(defaultPassword) + defaultSalt);

exports.login = function *() {
    let username = this.request.body.username;
    let password = this.request.body.password;
    try {
        this.assertCSRF(this.request.body.csrf);
    } catch (err) {
        this.status = 403;
        this.body = {
            message: false
        };
        return false;
    }
    if (username === defaultUsername && password === defaultPassword) {
        this.cookies.set('VOTEID', defaultCookie, {expires: new Date(Date.now() + 72 * 3600000)});
        this.redirect('/clgxtmain');
    } else {
        this.status = 403;
        this.body = {
            message: false
        };
        return false;
    }
};

exports.check = function *() {
    let voteid = this.cookies.get('VOTEID');
    if (voteid === defaultCookie) {
        return true;
    } else {
        return false;
    }
};