'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileSchema = _mongoose2.default.Schema({
  accountId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'accounts'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  imageId: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    unique: true
    // ref: 'assets',
  }
});

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('profiles', profileSchema, 'profiles', skipInit);