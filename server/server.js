"use strict"
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000;

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
  console.log('in data')
  console.log('req.headers',  req.headers)
  res.json({status: 'SUCCESS'});
});

if(require.main === module) {
  app.listen(8000, () => {
    console.log(`listening on port ${port}`)
  });

}