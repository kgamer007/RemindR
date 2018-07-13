'use strict';

const faker = require('faker');
const uuid = require('uuid/v4');

const loadTestUser = module.exports = {};

loadTestUser.create = (userContext, events, done) => {
  // properties from my account schema
  userContext.vars.username = faker.internet.userName() + uuid();
  userContext.vars.email = faker.internet.email() + uuid();
  userContext.vars.password = faker.internet.password() + uuid();
  userContext.vars.phone = `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, '') + uuid();

  // properties from my profile schema
  userContext.vars.firstName = faker.name.firstName() + uuid();
  userContext.vars.lastName = faker.name.lastName() + uuid();
  return done();
};
