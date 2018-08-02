'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reminderSchema = _mongoose2.default.Schema({
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
  sendTime: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly']
  }
}, { timestamps: true });

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('reminders', reminderSchema, 'reminders', skipInit);