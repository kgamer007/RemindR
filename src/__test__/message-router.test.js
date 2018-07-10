import createMockMessage from './lib/message-mock';
import { startServer, stopServer } from '../lib/server';

// const apiUrl = `http://localhost:${process.env.PORT}/api`;

beforeAll(startServer);
afterAll(stopServer);

describe('POST api/messages', () => {
  test('200 for succesful POST message', () => {
    console.log(createMockMessage(), 'create mock message');
    return createMockMessage()
      .then((response) => {
        console.log(response, 'RESPONSE IN MESSAGE ROUTER');
      })
      .catch((err) => {
        console.log(err, 'ERR FROM MESSAGE ROUTER');
      });
    // console.log(message);
  });
});
