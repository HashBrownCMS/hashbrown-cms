'use strict';

var chai = require('chai');
var expect = chai.expect;
chai.Assertion.includeStack = true;

var xoauth2 = require('../src/xoauth2');
var mockServer = require('./server');

describe('XOAuth2 tests', function() {
    this.timeout(10000);

    var server;
    var users = {};
    var XOAUTH_PORT = 8993;

    beforeEach(function(done) {
        server = mockServer({
            port: XOAUTH_PORT,
            onUpdate: function(username, accessToken) {
                users[username] = accessToken;
            }
        });
        server.addUser('test@example.com', 'saladus');
        server.start(done);
    });

    afterEach(function(done) {
        server.stop(done);
    });

    it('should get an existing access token', function(done) {
        var xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'test@example.com',
            clientId: '{Client ID}',
            clientSecret: '{Client Secret}',
            refreshToken: 'saladus',
            accessUrl: 'http://localhost:' + XOAUTH_PORT + '/',
            accessToken: 'abc',
            timeout: 3600
        });

        xoauth2gen.getToken(function(err, token, accessToken) {
            expect(err).to.not.exist;
            expect(accessToken).to.equal('abc');
            done();
        });
    });

    it('should get an existing access token, no timeout', function(done) {
        var xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'test@example.com',
            clientId: '{Client ID}',
            clientSecret: '{Client Secret}',
            refreshToken: 'saladus',
            accessUrl: 'http://localhost:' + XOAUTH_PORT + '/',
            accessToken: 'abc'
        });

        xoauth2gen.getToken(function(err, token, accessToken) {
            expect(err).to.not.exist;
            expect(accessToken).to.equal('abc');
            done();
        });
    });

    it('should generate a fresh access token', function(done) {
        var xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'test@example.com',
            clientId: '{Client ID}',
            clientSecret: '{Client Secret}',
            refreshToken: 'saladus',
            accessUrl: 'http://localhost:' + XOAUTH_PORT + '/',
            timeout: 3600
        });

        xoauth2gen.getToken(function(err, token, accessToken) {
            expect(err).to.not.exist;
            expect(accessToken).to.equal(users['test@example.com']);
            done();
        });
    });

    it('should generate a fresh access token after timeout', function(done) {
        var xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'test@example.com',
            clientId: '{Client ID}',
            clientSecret: '{Client Secret}',
            refreshToken: 'saladus',
            accessUrl: 'http://localhost:' + XOAUTH_PORT + '/',
            accessToken: 'abc',
            timeout: 1
        });

        setTimeout(function() {
            xoauth2gen.getToken(function(err, token, accessToken) {
                expect(err).to.not.exist;
                expect(accessToken).to.equal(users['test@example.com']);
                done();
            });
        }, 3000);
    });

    it('should emit access token update', function(done) {
        var xoauth2gen = xoauth2.createXOAuth2Generator({
            user: 'test@example.com',
            clientId: '{Client ID}',
            clientSecret: '{Client Secret}',
            refreshToken: 'saladus',
            accessUrl: 'http://localhost:' + XOAUTH_PORT + '/',
            timeout: 3600
        });

        xoauth2gen.once('token', function(tokenData) {
            expect(tokenData).to.deep.equal({
                user: 'test@example.com',
                accessToken: users['test@example.com'],
                timeout: 3600
            });
            done();
        });

        xoauth2gen.getToken(function() {});
    });
});