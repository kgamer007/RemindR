import faker from 'faker';
import mongoose from 'mongoose';
import superagent from 'superagent';
import createMockMessage from './lib/message-mock';
import removeAllDocuments from './lib/remove-all-documents';

import { createAccountMockPromise } from './lib/account-mock';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/messages`;

beforeAll(startServer);
afterAll(stopServer);

const mockMessageData = {};
let token;
let message;

beforeEach(() => {
  return createAccountMockPromise()
    .then((mockAccountData) => {
      token = mockAccountData.token; // eslint-disable-line
      // JV: This is awesome that you guys figured out you could instantiate a new mongoose Objectid!
      mockMessageData.accountId = new mongoose.Types.ObjectId();
      mockMessageData.reminderId = new mongoose.Types.ObjectId();
      // JV: great job with this regex
      mockMessageData.sentTo = `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, '');
      mockMessageData.body = faker.lorem.words(5);
    })
    .catch((err) => {
      throw err;
    });
});

beforeEach(() => {
  return createMockMessage()
    .then((response) => {
      message = response;
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
  let message; //eslint-disable-line
  // // let accountId; //eslint-disable-line
  // let token;//eslint-disable-line
  
  test('GET 200 for a successful fetching of a message', () => {
    return createMockMessage()
      .then((mock) => {
        message = mock;
        return superagent.get(`${apiUrl}/${message._id}`)
          .set('Authorization', `Bearer ${token}`);
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.accountId).toEqual(message.accountId.toString());
        expect(response.body.reminderId).toEqual(message.reminderId.toString());
        expect(response.body.sendTo).toBe(message.sendTo);
        expect(response.body.body).toBe(message.body);
      })
      .catch((err) => {
        expect(err).toBe('ERROR');
      });
  });

  test('GET 404 for not found', () => {
    return (superagent.get(`${apiUrl}/BADID`))
      .set('Authorization', `Bearer ${token}`)
      .then(() => {
        expect(true).toBeFalsy();
      })
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });
});

// --------------- PUT ROUTE ----------------------

describe('PUT /api/messages/:id', () => {
  const mockMessageForUpdate = {
    sentTo: '15555555555',
    body: 'what up world?',
  };
  
  test('200 PUT for successful update of a message', () => {
    return createMockMessage()
      .then((mock) => {
        message = mock;
        return superagent.put(`${apiUrl}/${message._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(mockMessageForUpdate);
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.sentTo).toBe(mockMessageForUpdate.sentTo);
        expect(response.body.body).toBe(mockMessageForUpdate.body);
      })
      .catch((err) => {
        throw err;
      });
  });
  
  // test.only('400 PUT if no request body was provided', () => {
  //   return createMockMessage()
  //     .then(() => {
  //       return superagent.put(`${apiUrl}/${message._id}`)
  //         .set('Authorization', `Bearer ${token}`);
  //     })
  //     .then(() => {
  //       expect(true).toBeFalsy();
  //     })
  //     .catch((err) => {
  //       expect(err.status).toBe(400);
  //     });
  // });
  
  test('404 PUT for a valid request made with an id that was not found', () => {
    return superagent.put(`${apiUrl}/123`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockMessageForUpdate)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toBe(404);
      });
  });
});

// --------------DELETE ROUTE -------------------

describe('DELETE ROUTES to /api/messages/:id', () => {
  test('204 DELETE /api/images for succesful delete', async () => {
    try {
      const response = await superagent.delete(`${apiUrl}/${message._id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(204);
      // message.findById(message._id)
    } catch (error) {
      expect(error.status).toEqual('FAILING IN DELETE 204 POST');
    }
  });

  test('404 DELETE for bad id', async () => {
    try {
      const response = await superagent.delete(`${apiUrl}/${'BADID'}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response).toEqual('FAILING IN DELETE 404');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });
});
// });
