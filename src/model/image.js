'use strict';

import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
  fileName: {
    type: String,
  },
}, { timestamps: true });

const skiptInit = process.env.NODE_ENV === 'development';
export default mongoose.model('images', imageSchema, 'images', skiptInit);
