import 'babel-polyfill';
import faker from 'faker';
import { createAccountMockPromise } from './account-mock';
import Reminder from '../../model/reminder';

const createReminderMockPromise = async () => {
  const mockAcctResponse = await createAccountMockPromise();

  const reminder = await new Reminder({
    accountId: mockAcctResponse.account._id,
    sentTo: `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, ''),
    body: faker.lorem.words(5),
    sendTime: Date.now(),
    frequency: 'Daily',
  }).save();

  const mockData = {
    reminder,
    account: mockAcctResponse.account,
    token: mockAcctResponse.token,
  };

  return mockData;
};

export default createReminderMockPromise;
