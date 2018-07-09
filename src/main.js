'use strict';

// import mongoose from 'mongoose';

import { startServer } from './lib/server';


import Message from './model/message';

const myMessage = new Message({
  accountId: 'potato',
  sentTo: '+16502079775',
  body: 'sup world',
  reminderId: 'potatoID',
});

console.log(myMessage);
startServer();
myMessage.sendText();
