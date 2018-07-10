import Twilio from 'twilio';
import mongoose from 'mongoose';
// import HttpError from 'http-errors';
// import Profile from './profile';
// import logger from '../lib/logger';

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const messageSchema = mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accounts',
    require: true,
  },
  sentTo: {
    type: String,   
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  reminderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reminders',
    required: true,
  },
  replyTime: {
    type: Date,
    default: null,
  },
  replyBody: {
    type: String,
    default: null,
  },
}, { timestamp: true });

messageSchema.methods.sendText = function sendText() {
  client.messages.create({
    body: this.body,
    to: this.sentTo, // Text this number
    from: process.env.TWILIO_NUMBER, // From a valid Twilio number
  })
    .then(message => console.log(message.sid, 'MESSAGE SUCCESSFULLY SENT'))
    .catch(error => console.log(error, 'ERROR SENDING MESSAGE'));
};

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('messages', messageSchema, 'messages', skipInit);
