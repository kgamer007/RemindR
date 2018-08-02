'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import { model } from 'mongoose';

var imageBucket = __dirname + '/asset/imageBucket.jpg';
var apiUrl = 'http://localhost:' + process.env.PORT + '/api/images';

describe('Image Router at /api/images', function () {
  var image = void 0; //eslint-disable-line
  var account = void 0; //eslint-disable-line
  var token = void 0;
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  beforeEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var mockData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _imageMock.createImageMockPromise)();

          case 3:
            mockData = _context.sent;

            token = mockData.token; //eslint-disable-line
            account = mockData.account; //eslint-disable-line
            image = mockData.image; //eslint-disable-line
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', _context.t0);

          case 12:
            return _context.abrupt('return', undefined);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 9]]);
  })));
  afterEach(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _imageMock.removeImagesAndAccounts)();

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  describe('POST to /api/images', function () {
    test('POST 200', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var res;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).field('title', 'IMAGEHOLDER').attach('image', imageBucket);

            case 3:
              res = _context3.sent;

              expect(res.status).toEqual(200);
              expect(res.body.title).toEqual('IMAGEHOLDER');
              expect(res.body._id).toBeTruthy();
              expect(res.body.url).toBeTruthy();
              expect(res.body.fileName).toBeTruthy();
              _context3.next = 14;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3['catch'](0);

              expect(_context3.t0).toEqual('foo');

            case 14:
              return _context3.abrupt('return', undefined);

            case 15:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 11]]);
    })));

    test('POST 404 for bad request', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var res;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).attach('image', imageBucket);

            case 3:
              res = _context4.sent;

              expect(res).toEqual('BAD');
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4['catch'](0);

              expect(_context4.t0.status).toEqual(400);

            case 10:
              return _context4.abrupt('return', undefined);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 7]]);
    })));
  });

  describe('GET to /api/images', function () {
    test('GET 200', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var res;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _superagent2.default.get(apiUrl + '/' + image._id).set('Authorization', 'Bearer ' + token);

            case 3:
              res = _context5.sent;

              expect(res.status).toEqual(200);
              expect(res.body.url).toEqual(image.url);
              expect(res.body.fileName).toEqual(image.fileName);
              expect(res.body.accountId).toEqual(image.accountId.toString());
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5['catch'](0);

              expect(_context5.t0).toBe('ERROR');

            case 13:
              return _context5.abrupt('return', undefined);

            case 14:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 10]]);
    })));

    test('GET 404 for not found', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var res;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _superagent2.default.get(apiUrl + '/badId').set('Authorization', 'Bearer ' + token);

            case 3:
              res = _context6.sent;

              expect(res).toEqual('BAD');
              _context6.next = 10;
              break;

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6['catch'](0);

              expect(_context6.t0.status).toEqual(404);

            case 10:
              return _context6.abrupt('return', undefined);

            case 11:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[0, 7]]);
    })));
  });

  // describe('PUT to /api/images/:id?', () => {
  //   test('GET 200', async () => {
  //     try {
  //       const res = await (superagent.get(`${apiUrl}/${image._id}`))
  //         .set('Authorization', `Bearer ${token}`);
  //       expect(res.status).toEqual(200);
  //       expect(res.body.url).toEqual(image.url);
  //       expect(res.body.fileName).toEqual(image.fileName);
  //       expect(res.body.accountId).toEqual(image.accountId.toString());
  //     } catch (err) {
  //       expect(err).toBe('ERROR');
  //     }
  //     return undefined;
  //   });

  describe('DELETE to /api/images/:id?', function () {
    test('DELETE 204', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var res;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _superagent2.default.delete(apiUrl + '/' + image._id).set('Authorization', 'Bearer ' + token);

            case 3:
              res = _context7.sent;

              expect(res.status).toEqual(204);
              _image2.default.findById(image._id).then(function () {
                expect(true).toBeNull();
              }).catch(function () {
                expect(true).toBeTruthy();
              });
              _context7.next = 11;
              break;

            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7['catch'](0);

              expect(_context7.t0).toEqual('foo');

            case 11:
              return _context7.abrupt('return', undefined);

            case 12:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[0, 8]]);
    })));

    test('DELETE 404 for not found', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      var res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _superagent2.default.delete(apiUrl + '/badid').set('Authorization', 'Bearer ' + token);

            case 3:
              res = _context8.sent;

              expect(res).toEqual('BAD');
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8['catch'](0);

              expect(_context8.t0.status).toEqual(404);

            case 10:
              return _context8.abrupt('return', undefined);

            case 11:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined, [[0, 7]]);
    })));
  });
});