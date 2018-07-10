'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createImageMockPromise, removeImagesAndAccounts } from './lib/image-mock';

const imageBucket = `${__dirname}/asset/imageBucket`; // in place of AWS, a place holder of images
const apiUrl = `http://localhost:${process.env.PORT}/api/images`;

describe('TESTING CRUD ROUTES at /api/images', () => {

});
