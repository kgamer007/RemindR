'use strict';

import mongoose from 'mongoose';
import Twilio from 'twilio';
import HttpError from 'http-errors';
import logger from '../lib/logger';
// import Profile from './profile';

const imageSchema = mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

const skiptInit = process.env.NODE_ENV === 'development';
export default mongoose.model('images', imageSchema, 'images', skiptInit);
