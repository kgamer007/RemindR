'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/middleware/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _s2 = require('../lib/s3');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var imageRouter = new _express.Router();

imageRouter.post('/api/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'IMAGE ROUTER WILL NOT POST: not accessible'));

  var _request$files = _slicedToArray(request.files, 1),
      file = _request$files[0];

  _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER POST: valid image ready to upload: ' + JSON.stringify(file, null, 2));
  var key = file.filename + '.' + file.originalname;

  return (0, _s2.uploadS3Asset)(file.path, key).then(function (url) {
    _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER POST: valid image URL from Amazon S3: ' + url);

    return new _image2.default({
      title: request.body.title,
      accountId: request.account._id,
      fileName: key,
      url: url
    }).save();
  }).then(function (newImage) {
    _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER POST: new image created: ' + JSON.stringify(newImage, null, 2));
    return response.json(newImage);
  }).catch(next);
});

imageRouter.get('/api/images/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401), 'IMAGE ROUTER GET: invalid request');
  if (!request.params.id) return next(new _httpErrors2.default(400, 'IMAGE ROUTER GET: there is no ID'));

  return _image2.default.findById(request.params.id).then(function (image) {
    if (!image) return next(new _httpErrors2.default(404, 'IMAGE ROUTER GET: no images are found'));
    _logger2.default.log(_logger2.default.INFO, 'successfully found image ' + JSON.stringify(image, null, 2));
    return response.json(image);
  }).catch(next);
});

imageRouter.put('/api/images/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  var options = { runValidators: true, new: true };
  return _image2.default.findIdAndUpdate(request.params.id, request.body, options).then(function (updatedImage) {
    _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER PUT: successfully updated, we have 200 status');
    return response(updatedImage);
  }).catch(next);
});

imageRouter.delete('/api/images/:id?', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) return next(new _httpErrors2.default(401, 'IMAGE ROUTER DELETE: invalid request'));
  if (!request.account) return next(new _httpErrors2.default(400, 'IMAGE ROUTER DELETE: no id provided'));

  return _image2.default.findById(request.params.id).then(function (image) {
    if (!image) return next(new _httpErrors2.default(404, 'IMAGE ROUTER DELETE: image not found in database'));
    var key = image.fileName;
    return (0, _s2.removeS3Asset)(key);
  }).then(function () {
    _image2.default.findByIdAndRemove(request.params.id).then(function (image) {
      _logger2.default.log(_logger2.default.INFO, 'IMAGE ROUTER DELETE: succesfully deleted image', image);
      return response.sendStatus(204);
    });
  }).catch(next);
});

exports.default = imageRouter;