import { Router } from 'express';
import HttpErrors from 'http-errors';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware';
import logger from '../lib/logger';
import Message from '../model/message';

const messageRouter = new Router();

messageRouter.post('/api/messages', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(HttpErrors(401, 'MESSAGE ROUTER POST ERROR: not authorized'));

  logger.log(logger.INFO, `MESSAGE ROUTER POST: sending and saving a new message: ${JSON.stringify(request.body, null, 2)}`);

  Message.init()
    .then(() => {
      logger.log(logger.INFO, `MESSAGE ROUTER BEFORE SAVE: saved a new message: ${JSON.stringify(request.body)}`);
      const message = new Message(request.body);
      message.sendText();
      return message.save();
    })
    .then((savedMessage) => {
      return response.json(savedMessage);
    })
    .catch(next);
  return undefined;
});

messageRouter.get('/api/messages/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.params.id) return next(HttpErrors(400, 'MESSAGE ROUTER GET ERROR: bad request'));

  logger.log(logger.INFO, `MESSAGE ROUTER GET: fetching a new message: ${JSON.stringify(request.params.id, null, 2)}`);

  Message.init()
    .then(() => {
      logger.log(logger.INFO, `MESSAGE ROUTER BEFORE FETCH: fetched a new message: ${JSON.stringify(request.params.id)}`);
      Message.findById(request.params.id)
        .then((returnedMessage) => {
          if (!returnedMessage) return next(HttpErrors(404, 'MESSAGE NOT FOUND'));
          return response.json(returnedMessage);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
  return undefined;
});

messageRouter.put('/api/messages/:id', (request, response, next) => {
  if (JSON.stringify(request.body).length <= 2) return next(createError(400, 'Not found'));

  Message.init()
    .then(() => {
      logger.log(logger.INFO, `MESSAGE ROUTER BEFORE PUT: Updating message ${JSON.stringify(request.body)}`);

      const options = {
        new: true,
        runValidators: true,
      };

      return Message.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedMessage) => {
      logger.log(logger.INFO, `MESSAGE ROUTER AFTER PUT: Updated message details ${JSON.stringify(updatedMessage)}`);
      return response.json(updatedMessage);
    })
    .catch(next);
  return undefined;
});

messageRouter.delete('/api/mesages/:id', (request, response, next) => {
  Message.init()
    .then(() => {
      logger.log(logger.INFO, `MESSAGE ROUTER BEFORE DELETE: Deleting message #${request.params.id}`);
      return Message.findByIdAndRemove(request.params.id);
    })
    .then((data) => {
      return response.status(204).json(data);
    })
    .catch(next);
});

export default messageRouter;
