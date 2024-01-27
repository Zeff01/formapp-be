import { Router } from 'express';
import SessionsController from './sessions.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';
import {
  DeleteSessionDto,
  ICreateSessionDto,
  IPaySessionDto,
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
 * GET /
 * @summary Get Sessions
 * @tags sessions
 * @return {Sessions} 200 - getSessions
 */
sessionRouter.get('/', verifyAuthToken, controller.getSessions);
/**
 * POST /
 * @typedef {object} ICreateSessionDto
 * @tags users
 * @summary Create Session
 * @security BearerAuth
 * @property {string} name.required
 * @property {string} code.required
 * @property {string} price.required
 * @property {integer} maxMember.required
 * @property {string[]} teams
 * @property {string} name
 * @param {ICreateSessionDto} request.body.required
 * @return {Session} 201 - Session Created
 */

sessionRouter.post(
  '/',
  verifyAuthToken,
  RequestValidator.validate(ICreateSessionDto),
  controller.createSession
);
/**
 * POST /payment
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
  controller.paySession
);
/**
 * POST /payment/callback
 * @summary Payment Callback
 * @tags sessions
 * @return {Payments} 201 - paySession
 */
sessionRouter.post('/payment/callback', controller.paymentCallback);

/**
 * POST /payout/callback
 * @summary Payout Callback
 * @tags sessions
 * @return {Payments} 201 - paymentCallback
 */
sessionRouter.post('/payout/callback', controller.paymentCallback);
/**
 * DELETE /
 * @typedef {object} DeleteSessionDto
 * @summary Delete Session
 * @tags sessions
 * @property {string} code.required - Session Code
 * @param {DeleteSessionDto} request.body.required
 * @security BearerAuth
 * @return {Payments} 200 - Session Successfully Deleted
 */
sessionRouter.delete(
  '/',
  verifyAuthToken,
  RequestValidator.validate(DeleteSessionDto),
  controller.deleteSession
);

export default sessionRouter;
