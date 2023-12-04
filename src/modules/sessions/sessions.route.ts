import { Router } from 'express';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import SessionsController from './sessions.controller';
import { ICreateSessionDto, IPaySessionDto } from '@/dto/session.dto';

const sessionRouter: Router = Router();
const controller = new SessionsController();

sessionRouter.get('/', verifyAuthToken, controller.getSessions);
sessionRouter.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(ICreateSessionDto),
  controller.createSession
);
sessionRouter.post(
  '/payment',
  RequestValidator.validate(IPaySessionDto),
  controller.paySession
);
sessionRouter.post('/payment/callback', controller.paymentCallback);
sessionRouter.post('/payout/callback', controller.paymentCallback);

export default sessionRouter;
