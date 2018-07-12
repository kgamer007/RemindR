import 'babel-polyfill';
import faker from 'faker';
import mongoose from 'mongoose';
import Message from '../../model/message';

const createMockMessage = () => {
  const mockData = {
    accountId: new mongoose.Types.ObjectId(),
    reminderId: new mongoose.Types.ObjectId(),
    sentTo: `1${faker.phone.phoneNumberFormat()}`.replace(/-/g, ''),
    body: faker.lorem.words(5),
  };
  const newMessage = new Message(mockData);
  return newMessage.save();
};  

export default createMockMessage;
