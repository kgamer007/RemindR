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
  if (!request.account) return next(HttpErrors(401, 'MESSAGE ROUTER GET ERROR: not authorized'));

  logger.log(logger.INFO, `MESSAGE ROUTER GET: fetching a new message: ${JSON.stringify(request.params.id, null, 2)}`);

  Message.init()
    .then(() => {
      logger.log(logger.INFO, `MESSAGE ROUTER BEFORE FETCH: fetched a new message: ${JSON.stringify(request.params.id)}`);
      Message.findById(request.params.id)
        .then((returnedMessage) => {
          return response.json(returnedMessage);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
  return undefined;
});

export default messageRouter;
