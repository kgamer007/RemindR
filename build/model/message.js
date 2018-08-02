'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new _twilio2.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var messageSchema = _mongoose2.default.Schema({
  accountId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'accounts',
    require: true
  },
  sentTo: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  reminderId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'reminders',
    required: true
  },
  replyTime: {
    type: Date,
    default: null
  },
  replyBody: {
    type: String,
    default: null
  }
}, { timestamp: true });

messageSchema.methods.sendText = function sendText() {
  client.messages.create({
    body: this.body,
    to: this.sentTo, // Text this number
    from: process.env.TWILIO_NUMBER // From a valid Twilio number
  }).then(function (message) {
    _logger2.default.log(_logger2.default.INFO, 'SENDING A TEXT MESSAGE: ' + message);
  }).catch(function (error) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR SENDING A TEXT MESSAGE: ' + error);
  });
};

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('messages', messageSchema, 'messages', skipInit);