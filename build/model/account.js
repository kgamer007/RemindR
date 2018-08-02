'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HASH_ROUNDS = 8;
var TOKEN_SEED_LENGTH = 128;

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

accountSchema.methods.verifyPasswordPromise = function verifyPasswordPromise(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new _httpErrors2.default(401, 'ACCOUNT MODEL: incorrect data');
    }
    return _this;
  }).catch(function (err) {
    if (err.status === 401) {
      throw err;
    } else {
      throw new _httpErrors2.default(500, 'ERROR CREATING TOKEN: ' + JSON.stringify(err));
    }
  });
};

accountSchema.methods.createTokenPromise = function createTokenPromise() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (updatedAccount) {
    return _jsonwebtoken2.default.sign({ tokenSeed: updatedAccount.tokenSeed }, process.env.SECRET_KEY);
  }).catch(function (err) {
    throw new _httpErrors2.default(500, 'ERROR SAVING ACCOUNT or ERROR WITH JWT: ' + JSON.stringify(err));
  });
};

var skipInit = process.env.NODE_ENV === 'development';
var Account = _mongoose2.default.model('accounts', accountSchema, 'accounts', skipInit);

Account.create = function (username, email, password) {
  var phone = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '5555555555';

  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    password = null; /*eslint-disable-line*/
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed,
      phone: phone
    }).save();
  }).catch(function (err) {
    throw new _httpErrors2.default(500, 'ERROR WITH HASHING or ERR WITH SAVING ACCOUNT: ' + JSON.stringify(err));
  });
};

exports.default = Account;