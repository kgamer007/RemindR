'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('./account-mock');

var _reminder = require('../../model/reminder');

var _reminder2 = _interopRequireDefault(_reminder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createReminderMockPromise = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockAcctResponse, reminder, mockData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _accountMock.createAccountMockPromise)();

          case 2:
            mockAcctResponse = _context.sent;
            _context.next = 5;
            return new _reminder2.default({
              accountId: mockAcctResponse.account._id,
              sentTo: ('1' + _faker2.default.phone.phoneNumberFormat()).replace(/-/g, ''),
              body: _faker2.default.lorem.words(5),
              sendTime: Date.now(),
              frequency: 'Daily'
            }).save();

          case 5:
            reminder = _context.sent;
            mockData = {
              reminder: reminder,
              account: mockAcctResponse.account,
              token: mockAcctResponse.token
            };
            return _context.abrupt('return', mockData);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createReminderMockPromise() {
    return _ref.apply(this, arguments);
  };
}();

exports.default = createReminderMockPromise;