import { Router } from 'express';
import HttpErrors from 'http-errors';
import Account from '../model/account';
import basicAuthMiddleware from '../lib/middleware/basic-auth-middleware';
import logger from '../lib/logger';

const authRouter = new Router();

authRouter.post('/api/signup', (request, response, next) => {
  return Account.create(request.body.username, request.body.email, request.body.password, request.body.phone)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH-ROUTER /api/signup: creating token');
      console.log(`Creating account: ${account._id}.`); // eslint-disable-line
      return account.createTokenPromise();
    })
    .then((token) => {
      logger.log(logger.INFO, `AUTH-ROUTER /api/signup: returning a 200 code and a token ${token}`);
      const cookieOptions = { maxAge: 7 * 1000 * 60 * 60 * 24 };
      response.cookie('cookieToken', token, cookieOptions);
      return response.json({ token });
    })
    .catch(next);
});

authRouter.get('/api/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpErrors(400, 'AUTH-ROUTER: invalid request'));
  return request.account.createTokenPromise()
    .then((token) => {
      logger.log(logger.INFO, `AUTH-ROUTER /api/login - responding with a 200 status code and a token ${token}`);
      
      const cookieOptions = { maxAge: 7 * 1000 * 60 * 60 * 24 };
      response.cookie('cookieToken', token, cookieOptions);
      return response.json({ token });
    })
    .catch(next);
});

// authRouter.put('/api/login');

export default authRouter;
