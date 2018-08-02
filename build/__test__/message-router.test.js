'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _messageMock = require('./lib/message-mock');

var _messageMock2 = _interopRequireDefault(_messageMock);

var _removeAllDocuments = require('./lib/remove-all-documents');

var _removeAllDocuments2 = _interopRequireDefault(_removeAllDocuments);

var _accountMock = require('./lib/account-mock');

var _server = require('../lib/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api/messages';

beforeAll(_server.startServer);
afterAll(_server.stopServer);

var mockMessageData = {};
var token = void 0;
var message = void 0;

beforeEach(function () {
  return (0, _accountMock.createAccountMockPromise)().then(function (mockAccountData) {
    token = mockAccountData.token; // eslint-disable-line
    mockMessageData.accountId = new _mongoose2.default.Types.ObjectId();
    mockMessageData.reminderId = new _mongoose2.default.Types.ObjectId();
    mockMessageData.sentTo = ('1' + _faker2.default.phone.phoneNumberFormat()).replace(/-/g, '');
    mockMessageData.body = _faker2.default.lorem.words(5);
  }).catch(function (err) {
    throw err;
  });
});

beforeEach(function () {
  return (0, _messageMock2.default)().then(function (response) {
    message = response;
  }).catch(function (err) {
    throw err;
  });
});

afterEach(_removeAllDocuments2.default);

describe('POST api/messages', function () {
  test('200 for succesful POST message', function () {
    return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).send(mockMessageData).then(function (response) {
      expect(response.status).toBe(200);
    }).catch(function (err) {
      expect(err).toBe('foo');
    });
  });

  test('400 for a bad request', function () {
    delete mockMessageData.body;
    return _superagent2.default.post(apiUrl).set('Authorization', 'Bearer ' + token).send(mockMessageData).then(function (response) {
      expect(response.status).toBe('foo');
    }).catch(function (err) {
      expect(err.status).toBe(400);
    });
  });

  test('400 for no access', function () {
    return _superagent2.default.post(apiUrl).set('Authorization', 'BAD TOKEN').send(mockMessageData).then(function (response) {
      expect(response).toBe('foo');
    }).catch(function (err) {
      expect(err.status).toBe(400);
    });
  });
});

describe('GET api/messages/:id', function () {
  var message = void 0; //eslint-disable-line
  // // let accountId; //eslint-disable-line
  // let token;//eslint-disable-line

  test('GET 200 for a successful fetching of a message', function () {
    return (0, _messageMock2.default)().then(function (mock) {
      message = mock;
      return _superagent2.default.get(apiUrl + '/' + message._id).set('Authorization', 'Bearer ' + token);
    }).then(function (response) {
      expect(response.status).toBe(200);
      expect(response.body.accountId).toEqual(message.accountId.toString());
      expect(response.body.reminderId).toEqual(message.reminderId.toString());
      expect(response.body.sendTo).toBe(message.sendTo);
      expect(response.body.body).toBe(message.body);
    }).catch(function (err) {
      expect(err).toBe('ERROR');
    });
  });

  test('GET 404 for not found', function () {
    return _superagent2.default.get(apiUrl + '/BADID').set('Authorization', 'Bearer ' + token).then(function () {
      expect(true).toBeFalsy();
    }).catch(function (error) {
      expect(error.status).toEqual(404);
    });
  });
});

// --------------- PUT ROUTE ----------------------

describe('PUT /api/messages/:id', function () {
  var mockMessageForUpdate = {
    sentTo: '15555555555',
    body: 'what up world?'
  };

  test('200 PUT for successful update of a message', function () {
    return (0, _messageMock2.default)().then(function (mock) {
      message = mock;
      return _superagent2.default.put(apiUrl + '/' + message._id).set('Authorization', 'Bearer ' + token).send(mockMessageForUpdate);
    }).then(function (response) {
      expect(response.status).toBe(200);
      expect(response.body.sentTo).toBe(mockMessageForUpdate.sentTo);
      expect(response.body.body).toBe(mockMessageForUpdate.body);
    }).catch(function (err) {
      throw err;
    });
  });

  // test.only('400 PUT if no request body was provided', () => {
  //   return createMockMessage()
  //     .then(() => {
  //       return superagent.put(`${apiUrl}/${message._id}`)
  //         .set('Authorization', `Bearer ${token}`);
  //     })
  //     .then(() => {
  //       expect(true).toBeFalsy();
  //     })
  //     .catch((err) => {
  //       expect(err.status).toBe(400);
  //     });
  // });

  test('404 PUT for a valid request made with an id that was not found', function () {
    return _superagent2.default.put(apiUrl + '/123').set('Authorization', 'Bearer ' + token).send(mockMessageForUpdate).then(function (response) {
      throw response;
    }).catch(function (err) {
      expect(err.status).toBe(404);
    });
  });
});

// --------------DELETE ROUTE -------------------

describe('DELETE ROUTES to /api/messages/:id', function () {
  test('204 DELETE /api/images for succesful delete', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _superagent2.default.delete(apiUrl + '/' + message._id).set('Authorization', 'Bearer ' + token);

          case 3:
            response = _context.sent;

            expect(response.status).toEqual(204);
            // message.findById(message._id)
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            expect(_context.t0.status).toEqual('FAILING IN DELETE 204 POST');

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  })));

  test('404 DELETE for bad id', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _superagent2.default.delete(apiUrl + '/' + 'BADID').set('Authorization', 'Bearer ' + token);

          case 3:
            response = _context2.sent;

            expect(response).toEqual('FAILING IN DELETE 404');
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);

            expect(_context2.t0.status).toBe(404);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  })));
});
// });