'use strict';

import createMockMessage from './lib/message-mock';

require('./lib/message-mock');

describe('POST TEST to api/messages', () => {
  test('200 for successful message', () => {
    const mockMessage = createMockMessage();
    console.log(mockMessage);
  });
});
