'use strict';

import faker from 'faker';
import Image from '../../model/image';

const createImageMock = () => {
  const imageMock = {};
  imageMock.request = {
    account: imageMock.account._id,
    imageUrl: faker.random.image(),
  };
  return Image.create(imageMock.request.account, imageMock.request.imageUrl)
    .then((image) => {
      imageMock.image = image;
      return imageMock;
    });
};

const removeImageMock = () => Image.remove({});

export { createImageMock, removeImageMock };
