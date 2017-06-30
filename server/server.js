"use strict"
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('../config.json');
const jws = require('jws');

const app = express();
const port = process.env.PORT || 8000;
//const clientId = config.clientId;
//const clientSecret = config.clientSecret;
const cachedJwks = {};

//(function() {
//
//  const webpack = require('webpack');
//  const webpackConfig = require('../webpack.config.js');
//  const webpackDevMiddleware = require('webpack-dev-middleware');
//  const webpackHotMiddleware = require('webpack-hot-middleware');
//  var compiler = webpack(webpackConfig);
//
//  app.use(webpackDevMiddleware(compiler, {
//    noInfo    : true,
//    publicPath: webpackConfig.output.publicPath
//  }));
//
//  app.use(webpackHotMiddleware(compiler, {
//    log      : console.log,
//    path     : '/__webpack_hmr',
//    heartbeat: 10 * 1000
//  }));
//
//})();

app.use(express.static(path.join(__dirname, '../client')));

app.use(cookieParser());
app.use(session({
  secret: 'mt tamalpais',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));


app.post('/login', (req, res) => {

  console.log('were in the login');
});

app.get('/data', (req, res) => {
  console.log('in data');
  console.log('*********************************');
  console.log('cookies', req.cookies);
  console.log('*********************************');
  console.log('ReQ.query');
  console.log(req.query);
  console.log('*********************************');
  console.log('req.headers',  req.headers);
  
  
  // Decode the id_token first to:
  // 1. Verify that it is a JWT
  // 2. Decode the header, which contains the public key id (kid) we can use
  //    to verify the id_token signature. More information about validating
  //    id_tokens can be found here:
  //    http://developer.okta.com/docs/api/resources/oidc.html#validating-id-tokens
  

  var myToken = req.headers.authorization.split(' ');
  console.log('decoded idToken: ', myToken[1]);
  const decoded = jws.decode(myToken[1]);
  console.log(decoded);

  if (!decoded) {
    res.status(401).send('id_token could not be decoded from the response');
    return;
  }
  
  new Promise((resolve, reject) => {
    // If we've already cached this JWK, return it
    if (cachedJwks[decoded.header.kid]) {
      resolve(cachedJwks[decoded.header.kid]);
      return;
    }
    
    // If it's not in the cache, get the latest JWKS from /oauth2/v1/keys
    const options = {
      url: `${config.url}/oauth2/v1/keys`,
      json: true,
    };
    request(options, (err, resp, json) => {
      if (err) {
        reject(err);
        return;
      } else if (json.error) {
        reject(json);
        return;
      }
      
      json.keys.forEach(key => cachedJwks[key.kid] = key);
      if (!cachedJwks[decoded.header.kid]) {
        res.status(401).send('No public key for the returned id_token');
        return;
      }
      
      resolve(cachedJwks[decoded.header.kid]);
    });
  })
    .then((jwk) => {
      const claims = JSON.parse(decoded.payload);
    
    });
  
  
  
  
  
  
  
  res.json({status: 'SUCCESS'});
});

if(require.main === module) {
  app.listen(8000, () => {
    console.log(`listening on port ${port}`)
  });

}