import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Reminder from '../model/reminder';
import bearerAuthMiddleware from '../lib/middleware/bearer-auth-middleware';

const reminderRouter = new Router();

reminderRouter.post('/api/reminders', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(401, 'REMINDER ROUTER POST ERROR: not authorized'));
  
  Reminder.init()
    .then(() => {
      logger.log(logger.INFO, `REMINDER ROUTER BEFORE SAVE: Saved a new reminder ${JSON.stringify(request.body)}`);
      return new Reminder(request.body).save();
    })
    .then((newReminder) => {
      logger.log(logger.INFO, `REMINDER ROUTER AFTER SAVE: Saved a new reminder ${JSON.stringify(newReminder)}`);
      return response.json(newReminder);
    })
    .catch(next);
  
  return undefined;
});

reminderRouter.get('/api/reminders/:id?', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  Reminder.init()
    .then(() => {
      return Reminder.findOne({ _id: request.params.id });
    })
    .then((foundReminder) => {
      logger.log(logger.INFO, `REMINDER ROUTER: FOUND THE MODEL, ${JSON.stringify(foundReminder)}`);
      response.json(foundReminder);
    })
    .catch(next);
  
  return undefined;
});

reminderRouter.put('/api/reminders/:id?', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  Reminder.init()
    .then(() => {
      return Reminder.findByIdAndUpdate(request.params.id, request.body, { new: true });
    })
    .then((updatedReminder) => {
      logger.log(logger.INFO, `REMINDER ROUTER: UPDATED MODEL, ${JSON.stringify(updatedReminder)}`);
      response.json(updatedReminder);
    })
    .catch(next);
  
  return undefined;
});

reminderRouter.delete('/api/reminders/:id?', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(401, 'REMINDER ROUTER POST ERROR: not authorized'));

  Reminder.init()
    .then(() => {
      return Reminder.findByIdAndRemove(request.params.id);
      // return Reminder.findOneAndRemove({ _id: request.params.id });
    })
    .then((deletedReminder) => {
      logger.log(logger.INFO, `REMINDER ROUTER: FOUND THE MODEL, ${JSON.stringify(deletedReminder)}`);
      
      response.status(204).json(request.params.id);
    })
    .catch(next);
  
  return undefined;
});

export default reminderRouter;
