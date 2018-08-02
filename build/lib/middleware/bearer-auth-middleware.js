'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _util = require('util');

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jswtVerify = (0, _util.promisify)(_jsonwebtoken2.default.verify);

exports.default = function (request, response, next) {
  if (!request.headers.authorization) return next(new _httpErrors2.default(400, 'BEARER AUTH MIDDLEWARE: no headers auth my duderino'));

  var token = request.headers.authorization.split('Bearer ')[1];
  if (!token) return next(new _httpErrors2.default(400, 'BEARER AUTH MIDDLEWARE: no token received madame'));

  return jswtVerify(token, process.env.SECRET_KEY).catch(function (err) {
    return Promise.reject(new _httpErrors2.default(400, 'BEARER AUTH - JSONWEBTOKEN ERROR ' + JSON.stringify(err)));
  }).then(function (decryptedToken) {
    return _account2.default.findOne({ tokenSeed: decryptedToken.tokenSeed });
  }).then(function (account) {
    if (!account) return next(new _httpErrors2.default(400, 'BEARER AUTH- NO ACCOUNT HAS BEEN FOUND MATE'));
    request.account = account;
    return next();
  }).catch(next);
};