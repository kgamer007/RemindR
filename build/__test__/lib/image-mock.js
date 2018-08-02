'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeImagesAndAccounts = exports.createImageMockPromise = undefined;

require('babel-polyfill');

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _image = require('../../model/image');

var _image2 = _interopRequireDefault(_image);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createImageMockPromise = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockData, mockAccountRes, image;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockData = {};
            _context.next = 3;
            return (0, _accountMock.createAccountMockPromise)();

          case 3:
            mockAccountRes = _context.sent;

            mockData.account = mockAccountRes.account;
            mockData.token = mockAccountRes.token;
            _context.next = 8;
            return new _image2.default({
              title: _faker2.default.lorem.words(2),
              url: _faker2.default.random.image(),
              fileName: _faker2.default.system.fileName(),
              accountId: mockData.account._id
            }).save();

          case 8:
            image = _context.sent;


            mockData.image = image;
            return _context.abrupt('return', mockData);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createImageMockPromise() {
    return _ref.apply(this, arguments);
  };
}();

var removeImagesAndAccounts = function removeImagesAndAccounts() {
  return Promise.all([_image2.default.remove({}), _account2.default.remove({})]);
};

exports.createImageMockPromise = createImageMockPromise;
exports.removeImagesAndAccounts = removeImagesAndAccounts;