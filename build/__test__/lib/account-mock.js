'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAccountMockPromise = exports.createAccountMockPromise = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAccountMockPromise = function createAccountMockPromise() {
  var mockData = {};
  var originalRequest = {
    username: _faker2.default.internet.userName(),
    email: _faker2.default.internet.email(),
    password: _faker2.default.lorem.words(5),
    phone: _faker2.default.phone.phoneNumberFormat(0)
  };
  return _account2.default.create(originalRequest.username, originalRequest.email, originalRequest.password, originalRequest.phone).then(function (account) {
    mockData.originalRequest = originalRequest;
    mockData.account = account;
    return account.createTokenPromise(); // this line changes the token seed
  }).then(function (token) {
    mockData.token = token;
    return _account2.default.findById(mockData.account._id);
  }).then(function (account) {
    mockData.account = account;
    return mockData;
  });
};

var removeAccountMockPromise = function removeAccountMockPromise() {
  return _account2.default.remove({});
};

exports.createAccountMockPromise = createAccountMockPromise;
exports.removeAccountMockPromise = removeAccountMockPromise;