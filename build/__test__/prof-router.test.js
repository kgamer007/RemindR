'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profMock = require('./lib/prof-mock');

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');

var apiUrl = 'http://localhost:' + process.env.PORT + '/api';

describe('TESTING PROFILE ROUTER', function () {
  var mockData = void 0;
  var token = void 0;
  var account = void 0;

  beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _server.startServer)();

          case 2:
            _context.next = 4;
            return (0, _accountMock.createAccountMockPromise)();

          case 4:
            mockData = _context.sent;
            // eslint-disable-line
            token = mockData.token; /*eslint-disable-line*/
            account = mockData.account; /*eslint-disable-line*/

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  afterEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _profMock.removeAllResources)();

          case 2:
            _context2.next = 4;
            return _account2.default.remove();

          case 4:
            _context2.next = 6;
            return _profile2.default.remove();

          case 6:
            _context2.next = 8;
            return (0, _server.stopServer)();

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  describe('GET ROUTES TESTING', function () {
    test('GET 200 to /api/profiles for successfully created profile', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var savedProfile, getProfile;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return (0, _profMock.createProfileMockPromise)();

            case 3:
              savedProfile = _context3.sent;
              _context3.next = 6;
              return _superagent2.default.get(apiUrl + '/profiles/' + savedProfile.profile._id).set('Authorization', 'Bearer ' + token);

            case 6:
              getProfile = _context3.sent;

              expect(getProfile.status).toEqual(200);
              _context3.next = 13;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3['catch'](0);

              expect(_context3.t0.status).toEqual('foo');

            case 13:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 10]]);
    })));

    test('GET 404 to /api/profiles for nonexistent profile', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var savedProfile, getProfile;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return (0, _profMock.createProfileMockPromise)();

            case 3:
              savedProfile = _context4.sent;
              _context4.next = 6;
              return _superagent2.default.get(apiUrl + '/profiles/' + savedProfile.profile.BADTOTHEPATH).set('Authorization', 'Bearer ' + token);

            case 6:
              getProfile = _context4.sent;

              expect(getProfile.status).toEqual('foo');
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4['catch'](0);

              expect(_context4.t0.status).toEqual(404);

            case 13:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 10]]);
    })));
    test('GET 400 to /api/profiles for the ol BAD TOKEROONIE', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var savedProfile, getProfile;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return (0, _profMock.createProfileMockPromise)();

            case 3:
              savedProfile = _context5.sent;
              _context5.next = 6;
              return _superagent2.default.get(apiUrl + '/profiles/' + savedProfile.profile._id).set('Authorization', 'Bearer justabunchagarbage');

            case 6:
              getProfile = _context5.sent;

              expect(getProfile.status).toEqual('foo');
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5['catch'](0);

              expect(_context5.t0.status).toEqual(400);

            case 13:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 10]]);
    })));
  });

  describe('POST ROUTES TESTING', function () {
    test('POST 200 to /api/profiles for successfully created profile', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var mockProfile, response;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              mockProfile = {
                firstName: _faker2.default.name.firstName(),
                lastName: _faker2.default.name.lastName(),
                accountId: mockData.account._id
              };
              _context6.prev = 1;
              _context6.next = 4;
              return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer ' + token).send(mockProfile);

            case 4:
              response = _context6.sent;

              expect(response.status).toEqual(200);
              expect(response.body.accountId).toEqual(account._id.toString());
              expect(response.body.firstName).toEqual(mockProfile.firstName);
              expect(response.body.lastName).toEqual(mockProfile.lastName);
              expect(response.body.imageId).toEqual(mockProfile.imageId);
              _context6.next = 15;
              break;

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6['catch'](1);

              expect(_context6.t0.status).toEqual('foo');

            case 15:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[1, 12]]);
    })));

    test('POST 401 for trying to post a profile w a bad token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer THISISABADTOKEN');

            case 3:
              _context7.next = 8;
              break;

            case 5:
              _context7.prev = 5;
              _context7.t0 = _context7['catch'](0);

              expect(_context7.t0.status).toEqual(400);

            case 8:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[0, 5]]);
    })));

    test('POST 409 for trying to post a duplicate profile', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var mockProfile, response, dupeResponse;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              mockProfile = {
                firstName: _faker2.default.name.firstName(),
                lastName: _faker2.default.name.lastName(),
                accountId: mockData.account._id
              };
              _context8.prev = 1;
              _context8.next = 4;
              return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer ' + token).send(mockProfile);

            case 4:
              response = _context8.sent;

              expect(response.status).toEqual(200);
              _context8.next = 11;
              break;

            case 8:
              _context8.prev = 8;
              _context8.t0 = _context8['catch'](1);

              expect(_context8.t0.status).toEqual('foo');

            case 11:
              _context8.prev = 11;
              _context8.next = 14;
              return _superagent2.default.post(apiUrl + '/profiles').set('Authorization', 'Bearer ' + token).send(mockProfile);

            case 14:
              dupeResponse = _context8.sent;

              expect(dupeResponse.status).toEqual('foo');
              _context8.next = 21;
              break;

            case 18:
              _context8.prev = 18;
              _context8.t1 = _context8['catch'](11);

              expect(_context8.t1.status).toEqual(409);

            case 21:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined, [[1, 8], [11, 18]]);
    })));
  });
});