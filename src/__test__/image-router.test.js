'use strict';

import superagent from 'superagent';
import Image from '../model/image';
import { startServer, stopServer } from '../lib/server';
import { createImageMockPromise, removeImagesAndAccounts } from './lib/image-mock';
// import { model } from 'mongoose';

const imageBucket = `${__dirname}/asset/imageBucket.jpg`;
const apiUrl = `http://localhost:${process.env.PORT}/api/images`;

describe('Image Router at /api/images', () => {
    let image; //eslint-disable-line
    let account; //eslint-disable-line
  let token;
  beforeAll(startServer);
  afterAll(stopServer);
  beforeEach(async () => {
    try {
      const mockData = await createImageMockPromise();
            token = mockData.token; //eslint-disable-line
            account = mockData.account; //eslint-disable-line
            image = mockData.image; //eslint-disable-line
    } catch (err) {
      return (err);
    }
    return undefined;
  });
  afterEach(async () => {
    await removeImagesAndAccounts();
  });

  describe('POST to /api/images', () => {
    test('POST 200', async () => {
      try {
        const res = await (superagent.post(apiUrl)
          .set('Authorization', `Bearer ${token}`)
          .field('title', 'IMAGEHOLDER')
          .attach('image', imageBucket));
        expect(res.status).toEqual(200);
        expect(res.body.title).toEqual('IMAGEHOLDER');
        expect(res.body._id).toBeTruthy();
        expect(res.body.url).toBeTruthy();
        expect(res.body.fileName).toBeTruthy();
      } catch (err) {
        expect(err).toEqual('foo');
      }
      return undefined;
    });

    test('POST 404 for bad request', async () => {
      try {
        const res = await (superagent.post(apiUrl)
          .set('Authorization', `Bearer ${token}`)
          .attach('image', imageBucket));
        expect(res).toEqual('BAD');
      } catch (err) {
        expect(err.status).toEqual(400);
      }
      return undefined;
    });
  });

  describe('GET to /api/images', () => {
    test('GET 200', async () => {
      try {
        const res = await (superagent.get(`${apiUrl}/${image._id}`))
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.url).toEqual(image.url);
        expect(res.body.fileName).toEqual(image.fileName);
        expect(res.body.accountId).toEqual(image.accountId.toString());
      } catch (err) {
        expect(err).toBe('ERROR');
      }
      return undefined;
    });

    test('GET 404 for not found', async () => {
      try {
        const res = await (superagent.get(`${apiUrl}/badId`))
          .set('Authorization', `Bearer ${token}`);
        expect(res).toEqual('BAD');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
      return undefined;
    });
  });

  // describe('PUT to /api/images/:id?', () => {
  //   test('GET 200', async () => {
  //     try {
  //       const res = await (superagent.get(`${apiUrl}/${image._id}`))
  //         .set('Authorization', `Bearer ${token}`);
  //       expect(res.status).toEqual(200);
  //       expect(res.body.url).toEqual(image.url);
  //       expect(res.body.fileName).toEqual(image.fileName);
  //       expect(res.body.accountId).toEqual(image.accountId.toString());
  //     } catch (err) {
  //       expect(err).toBe('ERROR');
  //     }
  //     return undefined;
  //   });

  describe('DELETE to /api/images/:id?', () => {
    test('DELETE 204', async () => {
      try {
        const res = await (superagent.delete(`${apiUrl}/${image._id}`))
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(204);
        Image.findById(image._id)
          .then(() => {
            expect(true).toBeNull();
          })
          .catch(() => {
            expect(true).toBeTruthy();
          });
      } catch (err) {
        expect(err).toEqual('foo');
      }
      return undefined;
    });

    test('DELETE 404 for not found', async () => {
      try {
        const res = await (superagent.delete(`${apiUrl}/badid`))
          .set('Authorization', `Bearer ${token}`);
        expect(res).toEqual('BAD');
      } catch (err) {
        expect(err.status).toEqual(404);
      }
      return undefined;
    });
  });
});
