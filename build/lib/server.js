'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _errorMiddleware = require('./middleware/error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

var _loggerMiddleware = require('./middleware/logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _authRouter = require('../router/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _messageRouter = require('../router/message-router');

var _messageRouter2 = _interopRequireDefault(_messageRouter);

var _imageRouter = require('../router/image-router');

var _imageRouter2 = _interopRequireDefault(_imageRouter);

var _profRouter = require('../router/prof-router');

var _profRouter2 = _interopRequireDefault(_profRouter);

var _reminderRouter = require('../router/reminder-router');

var _reminderRouter2 = _interopRequireDefault(_reminderRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// our routes


// middleware

var PORT = process.env.PORT || 3000;
var server = null;

// third party apps
app.use((0, _cors2.default)());
app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());

// our own api routers or middleware
app.use(_loggerMiddleware2.default);
app.use(_authRouter2.default);
app.use(_messageRouter2.default);
app.use(_reminderRouter2.default);
app.use(_imageRouter2.default);
app.use(_profRouter2.default);

// catch all
app.all('*', function (request, response) {
  return response.sendStatus(404).send('Route Not Registered');
});

app.use(_errorMiddleware2.default);
var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    console.log('Listening on PORT: ' + process.env.PORT); // eslint-disable-line
    server = app.listen(PORT, function () {});
  }).catch(function (err) {
    throw err;
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  }).catch(function (err) {
    throw err;
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;