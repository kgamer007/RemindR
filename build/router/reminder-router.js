'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _reminder = require('../model/reminder');

var _reminder2 = _interopRequireDefault(_reminder);

var _bearerAuthMiddleware = require('../lib/middleware/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reminderRouter = new _express.Router();

reminderRouter.post('/api/reminders', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  _reminder2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'REMINDER ROUTER BEFORE SAVE: Saved a new reminder ' + JSON.stringify(request.body));
    return new _reminder2.default(request.body).save();
  }).then(function (newReminder) {
    _logger2.default.log(_logger2.default.INFO, 'REMINDER ROUTER AFTER SAVE: Saved a new reminder ' + JSON.stringify(newReminder));
    return response.json(newReminder);
  }).catch(next);

  return undefined;
});

reminderRouter.get('/api/reminders/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  _reminder2.default.init().then(function () {
    return _reminder2.default.findOne({ _id: request.params.id });
  }).then(function (foundReminder) {
    _logger2.default.log(_logger2.default.INFO, 'REMINDER ROUTER: FOUND THE MODEL, ' + JSON.stringify(foundReminder));
    response.json(foundReminder);
  }).catch(next);

  return undefined;
});

reminderRouter.put('/api/reminders/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  _reminder2.default.init().then(function () {
    return _reminder2.default.findByIdAndUpdate(request.params.id, request.body, { new: true });
  }).then(function (updatedReminder) {
    _logger2.default.log(_logger2.default.INFO, 'REMINDER ROUTER: UPDATED MODEL, ' + JSON.stringify(updatedReminder));
    response.json(updatedReminder);
  }).catch(next);

  return undefined;
});

reminderRouter.delete('/api/reminders/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  _reminder2.default.init().then(function () {
    return _reminder2.default.findByIdAndRemove(request.params.id);
    // return Reminder.findOneAndRemove({ _id: request.params.id });
  }).then(function (deletedReminder) {
    _logger2.default.log(_logger2.default.INFO, 'REMINDER ROUTER: FOUND THE MODEL, ' + JSON.stringify(deletedReminder));

    response.status(204).json(request.params.id);
  }).catch(next);

  return undefined;
});

exports.default = reminderRouter;