const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const { getVerifiedUser } = require('./utils');
const webpackConfig = require('../webpack/config');

const compiler = webpack(webpackConfig);

const auth = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const user = await getVerifiedUser(authToken);
    if (user) {
      req.user = user;
    }
  }

  next();
};

const app = express();

app.use(bodyParser.json(), auth);
// app.use(bodyParser.json(), auth);

app.use('/public', express.static('public'));

app.use(
  require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
  })
); /* The webpack-dev-middleware serves the files emitted from webpack over a connect server and webpack-hot-middleware will allow us to hot reload on Express. */

/* if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.dev.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
} */

app.use(
  require('webpack-hot-middleware')(compiler, {
    log: false,
  })
);

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

module.exports = app;
