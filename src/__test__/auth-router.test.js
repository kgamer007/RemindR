import superagent from 'superagent';
import faker from 'faker';

import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise, removeAccountMockPromise } from './lib/account-mock';


require('dotenv').config({ path: `${__dirname}/../../.env` });

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('AUTH router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMockPromise);

  test('POST 200 to /api/signup for successful account creation and receipt of a TOKEN', async () => {
    const mockAccount = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'thestruggleisreal',
      phone: faker.phone.phoneNumberFormat(0),
    };
    
    try { 
      const response = await superagent.post(`${apiUrl}/signup`)
        .send(mockAccount);

      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    } catch (err) {
      throw err;
    }
  });

  test('GET 200 to api/login for successful login and receipt of a TOKEN', async () => {
    // let token;
    try {
      const mockData = await createAccountMockPromise();
      // token = mockData.token; 
      const response = await superagent.get(`${apiUrl}/login`)
        .auth(mockData.account.username, mockData.originalRequest.password); // this is how we send authorization headers via REST/HTTP
    
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
      // expect(response.body.token).toEqual(token);
    } catch (err) {
      throw err;
    }
  });

  test('GET 400 to /api/login for unsuccesful login with bad username and password', async () => {
    try { 
      const response = await superagent.get(`${apiUrl}/login`)
        .auth('bad username', 'bad password');
      throw response;
    } catch (err) {
      expect(err.status).toEqual(400);
    }
  });
});
