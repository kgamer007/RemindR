import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise } from './lib/account-mock';
import { removeAllResources } from './lib/prof-mock';

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
  afterEach(removeAllResources);

  describe('POST ROUTES TESTING', () => {
    test('POST 200 to /api/profiles for successfully created profile', async () => {
      const mockProfile = {
        firstName: faker.firstName(),
        lastName: faker.lastName(),
        imageId: faker.internet.url(),
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
        expect(err.status).toEqual(200);
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
  });
});
