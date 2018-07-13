import mongoose from 'mongoose';

const reminderSchema = mongoose.Schema({
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
  sendTime: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('reminders', reminderSchema, 'reminders', skipInit);
