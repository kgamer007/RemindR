'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeS3Asset = exports.uploadS3Asset = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadS3Asset = function uploadS3Asset(path, key) {
  var AWS = require('aws-sdk');
  var s3 = new AWS.S3(); //eslint-disable-line
  var uploadProperties = {
    Bucket: process.env.AWS_BUCKET,
    ACL: 'public-read',
    Key: key,
    Body: _fsExtra2.default.createReadStream(path)
  };

  return s3.upload(uploadProperties).promise().then(function (response) {
    _logger2.default.log(_logger2.default.INFO, 'SUCCESSFULLY HIT AWS AND RECEIVED RESPONSE: ' + JSON.stringify(response, null, 2));
    return _fsExtra2.default.remove(path).then(function () {
      return response.Location;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fsErr) {
      return Promise.reject(fsErr);
    });
  });
};

var removeS3Asset = function removeS3Asset(key) {
  var AWS = require('aws-sdk');
  var s3 = new AWS.S3(); //eslint-disable-line
  var removeProperties = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };
  return s3.deleteObject(removeProperties).promise();
};

exports.uploadS3Asset = uploadS3Asset;
exports.removeS3Asset = removeS3Asset;