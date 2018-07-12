import fs from 'fs-extra';
import logger from './logger';

const uploadS3Asset = (path, key) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3(); //eslint-disable-line
  const uploadProperties = {
    Bucket: process.env.AWS_BUCKET,
    ACL: 'public-read',
    Key: key,
    Body: fs.createReadStream(path),
  };

  return s3.upload(uploadProperties)
    .promise()
    .then((response) => {
      logger.log(logger.INFO, `SUCCESSFULLY HIT AWS AND RECEIVED RESPONSE: ${JSON.stringify(response, null, 2)}`);
      return fs.remove(path)
        .then(() => response.Location)
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fsErr => Promise.reject(fsErr));
    });
};

const removeS3Asset = (key) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3(); //eslint-disable-line
  const removeProperties = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return s3.deleteObject(removeProperties).promise();
};

export { uploadS3Asset, removeS3Asset };
