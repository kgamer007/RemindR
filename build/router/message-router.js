'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/middleware/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _message = require('../model/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageRouter = new _express.Router();

messageRouter.post('/api/messages', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next((0, _httpErrors2.default)(401, 'MESSAGE ROUTER POST ERROR: not authorized'));

  _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER POST: sending and saving a new message: ' + JSON.stringify(request.body, null, 2));

  _message2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER BEFORE SAVE: saved a new message: ' + JSON.stringify(request.body));
    var message = new _message2.default(request.body);
    message.sendText();
    return message.save();
  }).then(function (savedMessage) {
    return response.json(savedMessage);
  }).catch(next);
  return undefined;
});

messageRouter.get('/api/messages/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.params.id) return next((0, _httpErrors2.default)(400, 'MESSAGE ROUTER GET ERROR: bad request'));

  _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER GET: fetching a new message: ' + JSON.stringify(request.params.id, null, 2));

  _message2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER BEFORE FETCH: fetched a new message: ' + JSON.stringify(request.params.id));
    _message2.default.findById(request.params.id).then(function (returnedMessage) {
      if (!returnedMessage) return next((0, _httpErrors2.default)(404, 'MESSAGE NOT FOUND'));
      _logger2.default.log(_logger2.default.INFO, 'FOUND MESSAGE!!!!!!!!!!!!!!!: ' + JSON.stringify(returnedMessage, null, 2));
      return response.json(returnedMessage);
    }).catch(function (err) {
      next(err);
    });
  }).catch(next);
  return undefined;
});

messageRouter.put('/api/messages/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (JSON.stringify(request.body).length <= 2) return next((0, _httpErrors2.default)(400, 'Bad Request'));
  _message2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER BEFORE PUT: Updating message ' + JSON.stringify(request.body));

    var options = {
      new: true,
      runValidators: true
    };

    return _message2.default.findByIdAndUpdate(request.params.id, request.body, options);
  }).then(function (updatedMessage) {
    _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER AFTER PUT: Updated message details ' + JSON.stringify(updatedMessage));
    return response.json(updatedMessage);
  }).catch(next);
  return undefined;
});

messageRouter.delete('/api/messages/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  _message2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'MESSAGE ROUTER BEFORE DELETE: Deleting message #' + request.params.id);

    return _message2.default.findByIdAndRemove(request.params.id);
  }).then(function (data) {
    return response.status(204).json(data);
  }).catch(next);
});

exports.default = messageRouter;