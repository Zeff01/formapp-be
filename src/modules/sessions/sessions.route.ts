import { Router } from 'express';
import SessionsController from './sessions.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import {
  CreateSessionDto,
  CreateSubSessionDto,
  DeleteSessionDto,
  DeleteSubSessionDto,
  IPaySessionDto,
  UpdateMainSession,
  UpdateSubSession,
} from '@/dto/session.dto';

const sessionRouter: Router = Router();
const controller = new SessionsController();

/**
 * Sessions
 * @typedef {object} Sessions
 * @property {string} id - id
 * @property {string} name - name
 * @property {string[]} teams - teams
 * @property {integer} maxMember - max member
 * @property {integer} price - price
 * @property {string} founderId - founder id
 * @property {string} code - code
 * @property {string} createdAt - created at
 * @property {string} updatedAt - updated at
 */
/**
 * Xendit
 * @typedef {object} Xendit
 * @property {integer} amount
 * @property {string} currency
 * @property {string} description
 * @property {string} external_id
 * @property {string} success_redirect_url
 * @property {string} failure_redirect_url
 * @property {string} payer_email
 */
/**
 * Payments
 * @typedef {object} Payments
 * @property {string} id
 * @property {string} email
 * @property {string} sessionId
 * @property {integer} amount
 * @property {string} xenditReferenceId
 * @property {string} xenditPayoutId
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} status
 * @property {string} session
 * @property {string} user
 */

/**
 * GET /sessions/
 * @summary Get Sessions
 * @tags sessions
 * @security BearerAuth
 * @return {Sessions} 200 - getSessions
 */
sessionRouter.get('/', controller.getSessions);

sessionRouter.get(
  '/players',
  verifyAuthToken,
  controller.getPlayersPerSubSession
);
// /**
//  * POST /sessions/
//  * @typedef {object} ICreateSessionDto
//  * @tags sessions
//  * @summary Create Session
//  * @security BearerAuth
//  * @property {string} name.required
//  * @property {string} code.required
//  * @property {string} price.required
//  * @property {integer} maxMember.required
//  * @property {string[]} teams
//  * @property {string} name
//  * @security BearerAuth
//  * @param {ICreateSessionDto} request.body.required
//  * @return {Session} 201 - Session Created
//  */

sessionRouter.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(CreateSessionDto),
  controller.createSession
);

sessionRouter.patch(
  '/',
  verifyAuthToken,
  RequestValidator.validate(UpdateMainSession),
  controller.updateMainSession
);

sessionRouter.patch(
  '/rm',
  verifyAuthToken,
  RequestValidator.validate(DeleteSessionDto),
  controller.deleteMainSession
);

sessionRouter.patch(
  '/sub',
  verifyAuthToken,
  RequestValidator.validate(UpdateSubSession),
  controller.updateSubSession
);

sessionRouter.patch(
  '/sub/rm',
  verifyAuthToken,
  RequestValidator.validate(DeleteSubSessionDto),
  controller.deleteSubSession
);

sessionRouter.post(
  '/sub',
  verifyAuthToken,
  RequestValidator.validate(CreateSubSessionDto),
  controller.createSubSession
);

sessionRouter.get('/game', verifyAuthToken, controller.getGamePerSubId);

sessionRouter.get('/rates', controller.getRates)
/**
 * POST sessions/payment
 * @typedef {object} IPaySessionDto
 * @summary Sessions Payment
 * @tags sessions
 * @property {string} sessiionId - session id
 * @property {string} email - email
 * @param {IPaySessionDto} request.body.required
 * @return {Xendit} 201 - paySession
 */

sessionRouter.post(
  '/payment',
  RequestValidator.validate(IPaySessionDto),
  controller.paySubSession
);
// /**
//  * POST sessions/payment/callback
//  * @summary Payment Callback
//  * @tags sessions
//  * @return {Payments} 201 - paySession
//  */
sessionRouter.post('/payment/callback', controller.paymentCallback);

// /**
//  * POST sessions/payout/callback
//  * @summary Payout Callback
//  * @tags sessions
//  * @return {Payments} 201 - paymentCallback
//  */
sessionRouter.post('/payout/callback', controller.paymentCallback);

sessionRouter.get('/view', verifyAuthToken, controller.getPlayersBySubSession);
export default sessionRouter;
