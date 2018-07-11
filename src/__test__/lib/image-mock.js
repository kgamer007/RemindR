import 'babel-polyfill';
import faker from 'faker';
import Image from '../../model/image';
import Account from '../../model/account';
import { createAccountMockPromise } from './account-mock';


const createImageMockPromise = async () => {
  const mockData = {};
  const mockAccountRes = await createAccountMockPromise();
  mockData.account = mockAccountRes.account;
  mockData.token = mockAccountRes.token;
  const image = await new Image({
    account: mockData.account._id,
    imageUrl: faker.random.image(),
  }).save();
  mockData.image = image;
  return mockData;
};


const removeImagesAndAccounts = () => {
  return Promise.all([
    Image.remove({}),
    Account.remove({}),
  ]);
};

export { createImageMockPromise, removeImagesAndAccounts };
