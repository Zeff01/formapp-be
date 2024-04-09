/* eslint-disable */
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
 * @property {string} location - location
 * @property {string} sessionDate - session date
 * @property {string} sessionTime - session time
 * @property {string} createdAt - created at
 * @property {string} updatedAt - updated at
 * @property {SubSession[]} subSession - sub session
 * @property {string} createdBy - created by
 */

/**
 * Create Session Body
 * @typedef {object} CreateSession
 * @property {string} name.required - Name of the session
 * @property {string} location.required - location
 * @property {string} sessionTime.required - Time of session
 * @property {string} sessionDate.required - Date of session
 * @property {string} createdBy.required - Created By Identifier
 * @property {SubSession[]} subSession.required - Sub Session(s)
 *
 */

/**
 * Create Sub Session
 * @typedef {object} CreateSubSession
 * @property {string} sessionId.required - Session ID
 * @property {string} coach.required - Coach of the session
 * @property {integer} noofTeams.required - Number of teams that will be created
 * @property {integer} maxperTeams.required - Maximum player of all teams that has been created
 * @property {integer} maxPlayers.required - Maximum player per teams that will be created
 * @property {'OPENPLAY' | 'TRAINING' | 'TOURNAMENT'} sessionType.required - Type of session (OPENPLAY, TRAINING, TOURNAMENT)
 * @property {TeamSubSession} teams.required - Team Sub Session
 * @property {RateSubSession} packages.required - Rate Sub Session
 *
 */
/**
 * Sub Session
 * @typedef {object} SubSession
 * @property {string} sessionId - Session ID
 * @property {string} coach - Coach of the session
 * @property {integer} noofTeams - Number of teams that will be created
 * @property {integer} maxperTeams - Maximum player of all teams that has been created
 * @property {integer} maxPlayers - Maximum player per teams that will be created
 * @property {'OPENPLAY' | 'TRAINING' | 'TOURNAMENT'} - Type of session (OPENPLAY, TRAINING, TOURNAMENT)
 * @property {TeamSubSession} teams - Team Sub Session
 * @property {RateSubSession} packages - Rate Sub Session
 *
 */

/**
 * Team Sub Session
 * @typedef {object} TeamSubSession
 * @property {string} teamName - Name of team
 * @property {string} color - color
 */

/**
 * Rate Sub Session
 * @typedef {object} RateSubSession
 * @property {string} packageName - Name of Package
 * @property {integer} cashRate - Cash Rate
 * @property {integer} onlineRate - Online Rate
 * @property {integer} sessionCount - Session Count
 */

/**
 * POST /sessions/sub
 * @summary Create Sub Session
 * @tags sessions
 * @param {CreateSubSession} request.body.required
 * @security BearerAuth
 * @return {SubSession} 201 - Sub Session Created
 */

sessionRouter.post(
  '/sub',
  verifyAuthToken,
  RequestValidator.validate(CreateSubSessionDto),
  controller.createSubSession
);

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

/**
 * GET /sessions/subsession
 * @summary Get SubSessions
 * @tags sessions
 * @security BearerAuth
 * @return {SubSessions} 200 - getsubSessions
 */

sessionRouter.get('/sub', controller.getSubSessions);

sessionRouter.get(
  '/players',
  verifyAuthToken,
  controller.getPlayersPerSubSession
);
/**
 * POST /sessions/
 * @typedef {object} ICreateSessionDto
 * @tags sessions
 * @param {CreateSession} request.body.required  ad
 * @summary Create Session
 * @security BearerAuth
 * @return {Sessions} 201 - Session Created
 */

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

sessionRouter.get('/game', verifyAuthToken, controller.getGamePerSubId);

sessionRouter.get('/rates', controller.getRates);
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
