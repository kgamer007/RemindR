require('babel-polyfill');

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise } from './lib/account-mock';
import { removeAllResources, createProfileMockPromise } from './lib/prof-mock';
import Account from '../model/account';
import Profile from '../model/profile';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('TESTING PROFILE ROUTER', () => {
  let mockData;
  let token;
  let account;
  beforeAll(async () => {
    startServer();
    mockData = await createAccountMockPromise();
    token = mockData.token;  /*eslint-disable-line*/
    account = mockData.account; /*eslint-disable-line*/
  });
  afterAll(stopServer);
  afterEach(async (done) => {
    await removeAllResources();
    await Account.remove();
    await Profile.remove();
    done();
  });

  describe('GET ROUTES TESTING', () => {
    test('GET 200 to /api/profiles for successfully created profile', async () => {
      try {
        const savedProfile = await createProfileMockPromise();
        const getProfile = await superagent.get(`${apiUrl}/profiles/${savedProfile.profile._id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(getProfile.status).toEqual(200);
      } catch (err) {
        expect(err.status).toEqual('foo');
      }
    });

    test('GET 404 to /api/profiles for nonexistent profile', async () => {
      try {
        const savedProfile = await createProfileMockPromise();
        const getProfile = await superagent.get(`${apiUrl}/profiles/${savedProfile.profile.BADTOTHEPATH}`)
          .set('Authorization', `Bearer ${token}`);
        expect(getProfile.status).toEqual('foo');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
    });
    test('GET 400 to /api/profiles for the ol BAD TOKEROONIE', async () => {
      try {
        const savedProfile = await createProfileMockPromise();
        const getProfile = await superagent.get(`${apiUrl}/profiles/${savedProfile.profile._id}`)
          .set('Authorization', 'Bearer justabunchagarbage');
        expect(getProfile.status).toEqual('foo');
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });
  });
  describe('POST ROUTES TESTING', () => {
    test('POST 200 to /api/profiles for successfully created profile', async () => {
      const mockProfile = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        accountId: mockData.account._id,
      };
      try {
        const response = await superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${token}`)
          .send(mockProfile);
        expect(response.status).toEqual(200);
        expect(response.body.accountId).toEqual(account._id.toString());
        expect(response.body.firstName).toEqual(mockProfile.firstName);
        expect(response.body.lastName).toEqual(mockProfile.lastName);
        expect(response.body.imageId).toEqual(mockProfile.imageId);
      } catch (err) {
        expect(err.status).toEqual('foo');
      }
    });

    test('POST 401 for trying to post a profile w a bad token', async () => {
      try {
        await superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', 'Bearer THISISABADTOKEN');
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('POST 409 for trying to post a duplicate profile', async () => {
      const mockProfile = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        accountId: mockData.account._id,
      };
      try {
        const response = await superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${token}`)
          .send(mockProfile);
        expect(response.status).toEqual(200);
      } catch (err) {
        expect(err.status).toEqual('foo');
      }
      try {
        const dupeResponse = await superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${token}`)
          .send(mockProfile);
        expect(dupeResponse.status).toEqual('foo');
      } catch (err) {
        expect(err.status).toEqual(409);
      }
    });
  });
});
