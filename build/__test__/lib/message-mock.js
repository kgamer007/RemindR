'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _message = require('../../model/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createMockMessage = function createMockMessage() {
  var mockData = {
    accountId: new _mongoose2.default.Types.ObjectId(),
    reminderId: new _mongoose2.default.Types.ObjectId(),
    sentTo: ('1' + _faker2.default.phone.phoneNumberFormat()).replace(/-/g, ''),
    body: _faker2.default.lorem.words(5)
  };
  var newMessage = new _message2.default(mockData);
  return newMessage.save();
};

exports.default = createMockMessage;