'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _bearerAuthMiddleware = require('../lib/middleware/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileRouter = new _express.Router();

profileRouter.post('/api/profiles', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'POST PROFILE ROUTER-AUTH: invalid request'));
  _profile2.default.init().then(function () {
    return new _profile2.default(_extends({}, request.body, {
      accountId: request.account._id
    })).save().then(function (profile) {
      _logger2.default.log(_logger2.default.INO, 'POST PROFILE ROUTER: new profile created with 200 code, ' + JSON.stringify(profile, null, 2));
      return response.json(profile);
    }).catch(next);
  }).catch(next);
  return undefined;
});

profileRouter.get('/api/profiles/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'GET PROFILE ROUTER-AUTH: invalid request'));
  if (!request.params.id) {
    _profile2.default.find({}).then(function (profiles) {
      return response.json(profiles);
    }).catch(next);
    return undefined;
  }
  _profile2.default.findOne({ _id: request.params.id }).then(function (profile) {
    if (!profile) return next(new _httpErrors2.default(400, 'profile not found'));
    _logger2.default.log(_logger2.default.INFO, 'PROFILE ROUTER GET: found profile: ' + JSON.stringify(profile, null, 2));
    return response.json(profile);
  }).catch(next);
  return undefined;
});

profileRouter.put('/api/profiles/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'GET IT FIRST'));
  if (!request.params.id) {
    _profile2.default.find({}).then(function (profiles) {
      return response.json(profiles);
    }).catch(next);
    return undefined;
  }
  _profile2.default.findOneAndUpdate(request.params._id, request.body, { new: true }).then(function (updatedProfile) {
    _logger2.default.log(_logger2.default.INFO, 'PROFILE ROUTER PUT: found profile ' + JSON.stringify(updatedProfile, null, 2));
    return response.json(updatedProfile);
  }).catch(next);
  return undefined;
});

profileRouter.delete('/api/profiles/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'GET IT FIRST'));
  if (!request.params.id) {
    _profile2.default.find({}).then(function (profiles) {
      return response.json(profiles);
    }).catch(next);
    return undefined;
  }
  _profile2.default.findByIdAndRemove(request.params._id).then(function () {
    var successfulDelete = {
      message: 'Profile successfully deleted yall',
      id: request._id
    };
    return response.status(204).send(successfulDelete);
  }).catch(next);
  return undefined;
});

exports.default = profileRouter;