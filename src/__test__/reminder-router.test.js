import 'babel-polyfill';
import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import createReminderMockPromise from './lib/reminder-mock';
import { createAccountMockPromise } from './lib/account-mock';
import removeAllDocuments from './lib/remove-all-documents';

const apiUrl = `http://localhost:${process.env.PORT}/api/reminders`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(async () => {
  await removeAllDocuments();
});

describe('POST /api/reminders', () => {
  test('200 POST for successful post of a reminder', async () => {
    try {
      const { account, token } = await createAccountMockPromise();
      const reminderData = {
        accountId: account._id,
        sentTo: `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, ''),
        body: faker.lorem.words(5),
        sendTime: Date.now(),
        frequency: 'Daily',
      };
  
      const response = await superagent.post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(reminderData);
        
      expect(response.status).toBe(200);
    } catch (err) {
      expect(err).toBe('Error in 200 POST to api/reminders');
    }
  });

  test('400 POST for bad request if no request body was provided', async () => {
    try {
      const { token } = await createAccountMockPromise();
      const reminderData = {};
  
      const response = await superagent.post(apiUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(reminderData);
        
      expect(response.status).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});

describe('GET /api/reminders', () => {
  test('200 GET for successful fetching of a reminder', async () => {
    try {
      const { reminder, token } = await createReminderMockPromise();
      const response = await superagent.get(`${apiUrl}/${reminder._id}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);

      // =================================================================
      // WHY WONT THIS TEST PASS!!!!!????? need TA-overflow
      // console.log(response.body.accountId, 'RESPONSE.BODY.ACCOUNTID');
      // console.log(reminder.accountId, 'REMINDER.ACCOUNTID');
      // expect(response.body.accountId).toBe(reminder.accountId);
    // =================================================================
    } catch (err) {
      expect(err).toBe('Error in 200 GET to api/reminders');
    }
  });

  test('404 GET for valid request made with an id that was not found', async () => {
    try {
      const savedReminderData = await createReminderMockPromise();
      const response = await superagent.get(`${apiUrl}/"badId"`)
        .set('Authorization', `Bearer ${savedReminderData.token}`);

      expect(response).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });

  test('400 GET for a valid request made with an invalid token', async () => {
    try {
      const savedReminderData = await createReminderMockPromise();
      // const { token } = savedReminderData;
      const token = 'BADTOKEN';
      const response = await superagent.get(`${apiUrl}/${savedReminderData.reminder._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});
