xoauth2
=======

XOAuth2 token generation with node.js

## Installation

    npm install xoauth2

## Usage

**xoauth2** generates XOAUTH2 login tokens from provided Client and User credentials.

Use `xoauth2.createXOAuth2Generator(options)` to initialize Token Generator

Possible options values:

  * **user** _(Required)_ User e-mail address
  * **accessUrl** _(Optional)_ Endpoint for token generation (defaults to *https://accounts.google.com/o/oauth2/token*)
  * **clientId** _(Required)_ Client ID value
  * **clientSecret** _(Required)_ Client secret value
  * **refreshToken** _(Required)_ Refresh token for an user
  * **accessToken** _(Optional)_ initial access token. If not set, a new one will be generated
  * **timeout** _(Optional)_ TTL in **seconds**
  * **customHeaders** _(Optional)_ custom headers to send during token generation request [yahoo requires `Authorization: Basic Base64(clientId:clientSecret)` ](https://developer.yahoo.com/oauth2/guide/flows_authcode/#step-5-exchange-refresh-token-for-new-access-token)
  * **customParams** _(Optional)_ custom payload to send on getToken request [yahoo requires redirect_uri to be specified](https://developer.yahoo.com/oauth2/guide/flows_authcode/#step-5-exchange-refresh-token-for-new-access-token)

See [https://developers.google.com/identity/protocols/OAuth2WebServer#offline](https://developers.google.com/identity/protocols/OAuth2WebServer#offline) for generating the required credentials

For Google service account the option values are:

  * **service** _(Required)_ Service account email.
  * **user** _(Required)_ User e-mail address
  * **scope** _(Required)_ OAuth2 scope.
  * **privateKey** _(Required)_ Private key issued for the service account in PEM format, as a string.
  * **serviceRequestTimeout** _(Optional)_ Expiration value to use in the token request in **seconds**. Maximum is 3600.
  * **accessUrl** _(Optional)_ Endpoint for token generation (defaults to *https://accounts.google.com/o/oauth2/token*)
  * **accessToken** _(Optional)_ initial access token. If not set, a new one will be generated
  * **timeout** _(Optional)_ TTL in **seconds**
  * **customHeaders** _(Optional)_ custom headers to send during token generation request
  * **customParams** _(Optional)_ custom payload to send on getToken request

### Methods

#### Request an access token

Use `xoauth2obj.getToken(callback)` to get an access token. If a cached token is found and it should not be expired yet, the cached value will be used.

#### Request for generating a new access token

Use `xoauth2obj.generateToken(callback)` to get an access token. Cache will not be used and a new token is generated.

#### Update access token values

Use `xoauth2obj.updateToken(accessToken, timeout)` to set the new value for the xoauth2 access token. This function emits 'token'

### Events

If a new token value has been set, `'token'` event is emitted.

    xoauth2obj.on("token", function(token){
        console.log("User: ", token.user); // e-mail address
        console.log("New access token: ", token.accessToken);
        console.log("New access token timeout: ", token.timeout); // TTL in seconds
    });

### Example

    var xoauth2 = require("xoauth2"),
        xoauth2gen;

    xoauth2gen = xoauth2.createXOAuth2Generator({
        user: "user@gmail.com",
        clientId: "{Client ID}",
        clientSecret: "{Client Secret}",
        refreshToken: "{User Refresh Token}",
        customHeaders: {
          "HeaderName": "HeaderValue"
        },
        customPayload: {
          "payloadParamName": "payloadValue"
        }
    });

    // ... or for a Google service account
    xoauth2gen = xoauth2.createXOAuth2Generator({
        user: "user@gmail.com",
        service: '{Service Email Address}',
        scope: 'https://mail.google.com/',
        privateKey: '{Private Key in PEM format}'
    });

    // SMTP/IMAP
    xoauth2gen.getToken(function(err, token){
        if(err){
            return console.log(err);
        }
        console.log("AUTH XOAUTH2 " + token);
    });

    // HTTP
    xoauth2gen.getToken(function(err, token, accessToken){
        if(err){
            return console.log(err);
        }
        console.log("Authorization: Bearer " + accessToken);
    });

## License

**MIT**
