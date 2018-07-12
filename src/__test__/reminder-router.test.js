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
      expect(response.body.accountId).toBe(reminderData.accountId.toString());
      expect(response.body.body).toBe(reminderData.body);
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
      expect(response.body.accountId).toBe(reminder.accountId.toString());
      expect(response.body.body).toBe(reminder.body);
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

  test('400 GET for a valid request made with no token', async () => {
    try {
      const savedReminderData = await createReminderMockPromise();
      const token = 'BADTOKEN';
      const response = await superagent.get(`${apiUrl}/${savedReminderData.reminder._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});

describe('PUT /api/reminders', () => {
  test('200 for successful PUT', async () => {
    try {
      const updatedData = { body: 'new body' };

      const { reminder, token } = await createReminderMockPromise();
      const response = await superagent.put(`${apiUrl}/${reminder._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.body).toBe(updatedData.body);
    } catch (err) {
      expect(err).toBe('foo');
    }
  });

  test('404 for bad path', async () => {
    try {
      const updatedData = { body: 'new body' };

      const { token } = await createReminderMockPromise();
      const response = await superagent.put(`${apiUrl}/${'BADPATH'}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });

  test('400 for PUT with bad token', async () => {
    try {
      const updatedData = { body: 'new body' };

      const { reminder } = await createReminderMockPromise();
      const response = await superagent.put(`${apiUrl}/${reminder._id}`)
        .set('Authorization', `Bearer ${'BADTOKEN'}`)
        .send(updatedData);

      expect(response).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});

describe('DELETE api/reminders', () => {
  test('204 for successful delete', async () => {
    try {
      const { reminder, token } = await createReminderMockPromise();
      const response = await superagent.delete(`${apiUrl}/${reminder._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    } catch (err) {
      expect(err).toBe('foo');
    }
  });

  test('404 for bad path', async () => {
    try {
      const { token } = await createReminderMockPromise();
      const response = await superagent.delete(`${apiUrl}/${'BADPATH'}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response).toBe('foo');
    } catch (err) {
      expect(err.status).toBe(404);
    }
  });
});
