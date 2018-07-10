import faker from 'faker';
// import createAccountMockPromise from './account-mock';
import mongoose from 'mongoose';

const mockData = {
  accountId: mongoose.Schema.Types.ObjectId(),
  reminderId: mongoose.Schema.Types.ObjectId(),
  sentTo: `1${faker.phone.phoneNumberFormat()}`.replace('-', ''),
  body: faker.lorem.words(5),
};

console.log(mockData);
