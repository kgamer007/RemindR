'use strict';

require('dotenv').config();

process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.SECRET_KEY = 'helloWorldkdsjflad';

var isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fake';
  process.env.AWS_ACCESSS_KEY_ID = 'fake';
  require('./setup');
} else {
  // remember to set your .env vars and add .env in .gitignore
  require('dotenv').config();
}