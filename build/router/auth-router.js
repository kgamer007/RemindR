'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _basicAuthMiddleware = require('../lib/middleware/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = new _express.Router();

authRouter.post('/api/signup', function (request, response, next) {
  return _account2.default.create(request.body.username, request.body.email, request.body.password, request.body.phone).then(function (account) {
    delete request.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/signup: creating token');
    console.log('Creating account: ' + account._id + '.'); // eslint-disable-line
    return account.createTokenPromise();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/signup: returning a 200 code and a token ' + token);
    return response.json({ token: token });
  }).catch(next);
});

authRouter.get('/api/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(400, 'AUTH-ROUTER: invalid request'));
  return request.account.createTokenPromise().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH-ROUTER /api/login - responding with a 200 status code and a token ' + token);
    return response.json({ token: token });
  }).catch(next);
});

authRouter.put('/api/login');

exports.default = authRouter;