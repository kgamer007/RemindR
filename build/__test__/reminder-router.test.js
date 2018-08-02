'use strict';

require('babel-polyfill');

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _reminderMock = require('./lib/reminder-mock');

var _reminderMock2 = _interopRequireDefault(_reminderMock);

var _accountMock = require('./lib/account-mock');

var _removeAllDocuments = require('./lib/remove-all-documents');

var _removeAllDocuments2 = _interopRequireDefault(_removeAllDocuments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api/reminders';

beforeAll(_server.startServer);
afterAll(_server.stopServer);
afterEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _removeAllDocuments2.default)();

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

describe('POST /api/reminders', function () {
  test('200 POST for successful post of a reminder', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var _ref3, account, token, reminderData, response;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _accountMock.createAccountMockPromise)();

          case 3:
            _ref3 = _context2.sent;
            account = _ref3.account;
            token = _ref3.token;
            reminderData = {
              accountId: account._id,
              sentTo: ('1' + _faker2.default.phone.phoneNumberFormat()).replace(/-/g, ''),
              body: _faker2.default.lorem.words(5),
              sendTime: Date.now(),
              frequency: 'Daily'
            };
            _context2.next = 9;
            return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).send(reminderData);

          case 9:
            response = _context2.sent;


            expect(response.status).toBe(200);
            expect(response.body.accountId).toBe(reminderData.accountId.toString());
            expect(response.body.body).toBe(reminderData.body);
            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2['catch'](0);

            expect(_context2.t0).toBe('Error in 200 POST to api/reminders');

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 15]]);
  })));

  test('400 POST for bad request if no request body was provided', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _ref5, token, reminderData, response;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return (0, _accountMock.createAccountMockPromise)();

          case 3:
            _ref5 = _context3.sent;
            token = _ref5.token;
            reminderData = {};
            _context3.next = 8;
            return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).send(reminderData);

          case 8:
            response = _context3.sent;


            expect(response.status).toBe('foo');
            _context3.next = 15;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](0);

            expect(_context3.t0.status).toBe(400);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 12]]);
  })));
});

describe('GET /api/reminders', function () {
  test('200 GET for successful fetching of a reminder', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _ref7, reminder, token, response;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return (0, _reminderMock2.default)();

          case 3:
            _ref7 = _context4.sent;
            reminder = _ref7.reminder;
            token = _ref7.token;
            _context4.next = 8;
            return _superagent2.default.get(apiUrl + '/' + reminder._id).set('Authorization', 'Bearer ' + token);

          case 8:
            response = _context4.sent;


            expect(response.status).toBe(200);
            expect(response.body.accountId).toBe(reminder.accountId.toString());
            expect(response.body.body).toBe(reminder.body);
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4['catch'](0);

            expect(_context4.t0).toBe('Error in 200 GET to api/reminders');

          case 17:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 14]]);
  })));

  test('404 GET for valid request made with an id that was not found', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var savedReminderData, response;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return (0, _reminderMock2.default)();

          case 3:
            savedReminderData = _context5.sent;
            _context5.next = 6;
            return _superagent2.default.get(apiUrl + '/"badId"').set('Authorization', 'Bearer ' + savedReminderData.token);

          case 6:
            response = _context5.sent;


            expect(response).toBe('foo');
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5['catch'](0);

            expect(_context5.t0.status).toBe(404);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 10]]);
  })));

  test('400 GET for a valid request made with no token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var savedReminderData, token, response;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return (0, _reminderMock2.default)();

          case 3:
            savedReminderData = _context6.sent;
            token = 'BADTOKEN';
            _context6.next = 7;
            return _superagent2.default.get(apiUrl + '/' + savedReminderData.reminder._id).set('Authorization', 'Bearer ' + token);

          case 7:
            response = _context6.sent;


            expect(response.status).toBe('foo');
            _context6.next = 14;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6['catch'](0);

            expect(_context6.t0.status).toBe(400);

          case 14:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[0, 11]]);
  })));
});

describe('PUT /api/reminders', function () {
  test('200 for successful PUT', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var updatedData, _ref11, reminder, token, response;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            updatedData = { body: 'new body' };
            _context7.next = 4;
            return (0, _reminderMock2.default)();

          case 4:
            _ref11 = _context7.sent;
            reminder = _ref11.reminder;
            token = _ref11.token;
            _context7.next = 9;
            return _superagent2.default.put(apiUrl + '/' + reminder._id).set('Authorization', 'Bearer ' + token).send(updatedData);

          case 9:
            response = _context7.sent;


            expect(response.status).toBe(200);
            expect(response.body.body).toBe(updatedData.body);
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7['catch'](0);

            expect(_context7.t0).toBe('foo');

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[0, 14]]);
  })));

  test('404 for bad path', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var updatedData, _ref13, token, response;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            updatedData = { body: 'new body' };
            _context8.next = 4;
            return (0, _reminderMock2.default)();

          case 4:
            _ref13 = _context8.sent;
            token = _ref13.token;
            _context8.next = 8;
            return _superagent2.default.put(apiUrl + '/' + 'BADPATH').set('Authorization', 'Bearer ' + token).send(updatedData);

          case 8:
            response = _context8.sent;


            expect(response).toBe('foo');
            _context8.next = 15;
            break;

          case 12:
            _context8.prev = 12;
            _context8.t0 = _context8['catch'](0);

            expect(_context8.t0.status).toBe(404);

          case 15:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[0, 12]]);
  })));

  test('400 for PUT with bad token', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var updatedData, _ref15, reminder, response;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            updatedData = { body: 'new body' };
            _context9.next = 4;
            return (0, _reminderMock2.default)();

          case 4:
            _ref15 = _context9.sent;
            reminder = _ref15.reminder;
            _context9.next = 8;
            return _superagent2.default.put(apiUrl + '/' + reminder._id).set('Authorization', 'Bearer ' + 'BADTOKEN').send(updatedData);

          case 8:
            response = _context9.sent;


            expect(response).toBe('foo');
            _context9.next = 15;
            break;

          case 12:
            _context9.prev = 12;
            _context9.t0 = _context9['catch'](0);

            expect(_context9.t0.status).toBe(400);

          case 15:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined, [[0, 12]]);
  })));
});

describe('DELETE api/reminders', function () {
  test('204 for successful delete', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var _ref17, reminder, token, response;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return (0, _reminderMock2.default)();

          case 3:
            _ref17 = _context10.sent;
            reminder = _ref17.reminder;
            token = _ref17.token;
            _context10.next = 8;
            return _superagent2.default.delete(apiUrl + '/' + reminder._id).set('Authorization', 'Bearer ' + token);

          case 8:
            response = _context10.sent;


            expect(response.status).toBe(204);
            _context10.next = 15;
            break;

          case 12:
            _context10.prev = 12;
            _context10.t0 = _context10['catch'](0);

            expect(_context10.t0).toBe('foo');

          case 15:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined, [[0, 12]]);
  })));

  test('404 for bad path', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var _ref19, token, response;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return (0, _reminderMock2.default)();

          case 3:
            _ref19 = _context11.sent;
            token = _ref19.token;
            _context11.next = 7;
            return _superagent2.default.delete(apiUrl + '/' + 'BADPATH').set('Authorization', 'Bearer ' + token);

          case 7:
            response = _context11.sent;


            expect(response).toBe('foo');
            _context11.next = 14;
            break;

          case 11:
            _context11.prev = 11;
            _context11.t0 = _context11['catch'](0);

            expect(_context11.t0.status).toBe(404);

          case 14:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined, [[0, 11]]);
  })));
});