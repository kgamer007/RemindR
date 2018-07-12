import createMockMessage from './lib/message-mock';
import faker from 'faker';
import mongoose from 'mongoose';
import superagent from 'superagent';
import removeAllDocuments from './lib/remove-all-documents';

import { createAccountMockPromise } from './lib/account-mock';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/messages`;

beforeAll(startServer);
afterAll(stopServer);

const mockMessageData = {};
let token;

beforeEach(() => {
  return createAccountMockPromise()
    .then((mockAccountData) => {
      token = mockAccountData.token; // eslint-disable-line
      mockMessageData.accountId = new mongoose.Types.ObjectId();
      mockMessageData.reminderId = new mongoose.Types.ObjectId();
      mockMessageData.sentTo = `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, '');
      mockMessageData.body = faker.lorem.words(5);
    })
    .catch((err) => {
      throw err;
    });
});

afterEach(removeAllDocuments);

describe('POST api/messages', () => {
  test('200 for succesful POST message', () => {
    return superagent.post(apiUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(mockMessageData)
      .then((response) => {
        expect(response.status).toBe(200);
      })  
      .catch((err) => {
        expect(err).toBe('foo');
      });
  });

  test('400 for a bad request', () => {
    delete mockMessageData.body;
    return superagent.post(apiUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(mockMessageData)
      .then((response) => {
        expect(response.status).toBe('foo');
      })  
      .catch((err) => {
        expect(err.status).toBe(400);
      });
  });

  test('400 for no access', () => {
    return superagent.post(apiUrl)
      .set('Authorization', 'BAD TOKEN')
      .send(mockMessageData)
      .then((response) => {
        expect(response).toBe('foo');
      })  
      .catch((err) => {
        expect(err.status).toBe(400);
      });
  });
});

describe('GET api/messages/:id', () => {
  test('200 for a successful fetching of a message', () => {
    return superagent.get(`${apiUrl}/`)
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.status).toBe(200);
      })
      .catch((err) => {
        expect(err).toBe('foo');
      });
  });
});
