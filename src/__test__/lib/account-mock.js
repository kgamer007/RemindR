import faker from 'faker';
import Account from '../../model/account';
import { Organizations } from 'aws-sdk';

const createAccountMockPromise = () => {
  const mockData = {};
  const originalRequest = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    phone: faker.phone.phoneNumberFormat(0),
  };
  console.log(originalRequest.username, originalRequest.email, originalRequest.password, originalRequest.phone, '!!!!!!!!');
  return Account.create(originalRequest.username, originalRequest.email, originalRequest.password, originalRequest.phone)
    .then((account) => {
      mockData.originalRequest = originalRequest;
      mockData.account = account;
      return account.createTokenPromise(); // this line changes the token seed
    })
    .then((token) => {
      mockData.token = token;
      return Account.findById(mockData.account._id);
    })
    .then((account) => {
      mockData.account = account;
      return mockData;
    });
};

const removeAccountMockPromise = () => Account.remove({});

export { createAccountMockPromise, removeAccountMockPromise };
