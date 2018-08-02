'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

var _image = require('../../model/image');

var _image2 = _interopRequireDefault(_image);

var _message = require('../../model/message');

var _message2 = _interopRequireDefault(_message);

var _profile = require('../../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _reminder = require('../../model/reminder');

var _reminder2 = _interopRequireDefault(_reminder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeAllDocuments = function removeAllDocuments() {
  return Promise.all([_account2.default.remove(), _image2.default.remove(), _message2.default.remove(), _profile2.default.remove(), _reminder2.default.remove()]);
};

exports.default = removeAllDocuments;