'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config({ path: __dirname + '/../../.env' });

var apiUrl = 'http://localhost:' + process.env.PORT + '/api';

describe('AUTH router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.removeAccountMockPromise);

  test('POST 200 to /api/signup for successful account creation and receipt of a TOKEN', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockAccount, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockAccount = {
              username: _faker2.default.internet.userName(),
              email: _faker2.default.internet.email(),
              password: 'thestruggleisreal',
              phone: _faker2.default.phone.phoneNumberFormat(0)
            };
            _context.prev = 1;
            _context.next = 4;
            return _superagent2.default.post(apiUrl + '/signup').send(mockAccount);

          case 4:
            response = _context.sent;


            expect(response.status).toEqual(200);
            expect(response.body.token).toBeTruthy();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            throw _context.t0;

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 9]]);
  })));

  test('GET 200 to api/login for successful login and receipt of a TOKEN', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var mockData, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _accountMock.createAccountMockPromise)();

          case 3:
            mockData = _context2.sent;
            _context2.next = 6;
            return _superagent2.default.get(apiUrl + '/login').auth(mockData.account.username, mockData.originalRequest.password);

          case 6:
            response = _context2.sent;
            // this is how we send authorization headers via REST/HTTP

            expect(response.status).toEqual(200);
            expect(response.body.token).toBeTruthy();
            // expect(response.body.token).toEqual(token);
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 11]]);
  })));

  test('GET 400 to /api/login for unsuccesful login with bad username and password', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _superagent2.default.get(apiUrl + '/login').auth('bad username', 'bad password');

          case 3:
            response = _context3.sent;
            throw response;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            expect(_context3.t0.status).toEqual(400);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  })));
});