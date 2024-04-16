import { Router } from 'express';
import SessionsController from './sessions.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken, verifyAdmintAuthToken } from '@/middlewares/auth';
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
 *
 * Rates
 * @typedef {object} Rates
 * @property {string} id.required - id of the rate
 * @property {string} packageName.required - Name of the package
 * @property {integer} cashRate.required - Cash Rate
 * @property {integer} onlineRate.required - Online Rate
 * @property {integer} sessionCount.required - Session Count
 * @property {string} description.required - Description
 * @property {string} createdAt.required - Created At
 * @property {string} updatedAt.required - Updated At
 * @property {string} status.required - Status
 * @property {string} subSessionId.required - Sub Session ID
 *
 */

/**
 * POST /sessions/
 * @summary Create Session
 * @tags sessions
 * @param {CreateSession} request.body.required  ad
 * @security BearerAuth
 * @return {Sessions} 201 - Session Created
 */

sessionRouter.post(
  '/',
  verifyAdmintAuthToken,
  RequestValidator.validate(CreateSessionDto),
  controller.createSession
);

/**
 * GET /sessions/
 * @summary Get Sessions
 * @tags sessions
 * @param {string} from.query - Date From Session (YYYY-MM-DD)
 * @param {string} to.query - Date To Session (YYYY-MM-DD)
 * @return {Sessions} 200 - getSessions
 */

sessionRouter.get('/', controller.getSessions);

/**
 * Create Sub Session Body
 * @typedef {object} CreateSubSessionBody
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
 * Create Sub Session
 * @typedef {object} CreateSubSession
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
 * @property {string} description - description of session
 */

/**
 * Update Main Session Body
 * @typedef {object} UpdateMainSessionBody
 * @property {string} name.required - Session Name
 * @property {string} location.required - Location
 * @property {string} sessionDate.required - Session Date
 * @property {string} sessionTime.required - Session Time
 * @property {string} status.required - Status
 */

/**
 * Update Main Session
 * @typedef {object} UpdateMainSession
 * @property {string} name - Session Name
 * @property {string} location - Location
 * @property {string} sessionDate - Session Date
 * @property {string} sessionTime - Session Time
 * @property {string} status - Status
 */

/**
 * PATCH /sessions/
 * @summary Update Main Session
 * @tags sessions
 * @param {UpdateMainSessionBody} request.body.required
 * @security BearerAuth
 * @return {UpdateMainSession} 200 - Session Updated Successfully
 */

sessionRouter.patch(
  '/',
  verifyAdmintAuthToken,
  RequestValidator.validate(UpdateMainSession),
  controller.updateMainSession
);

/**
 * Delete Main Session Body
 * @typedef {object} DeleteMainSessionBody
 * @property {string} id.required - Session ID
 */

/**
 * Delete Main Session
 * @typedef {object} DeleteMainSession
 * @property {string} id - Session ID
 */

/**
 * PATCH /sessions/rm
 * @summary Delete Main Session
 * @tags sessions
 * @security BearerAuth
 * @param {DeleteMainSessionBody} request.body.required - ID of the session
 * @return {DeleteMainSession} 200 - Session Updated Successfully
 */

sessionRouter.patch(
  '/rm',
  verifyAdmintAuthToken,
  RequestValidator.validate(DeleteSessionDto),
  controller.deleteMainSession
);

/**
 * POST /sessions/sub
 * @summary Create Sub Session
 * @tags sessions
 * @param {CreateSubSessionBody} request.body.required
 * @security BearerAuth
 * @return {CreateSubSession} 201 - Sub Session Created
 */

sessionRouter.post(
  '/sub',
  verifyAuthToken,
  RequestValidator.validate(CreateSubSessionDto),
  controller.createSubSession
);

/**
 * GET /sessions/sub
 * @summary Get SubSessions
 * @tags sessions
 * @return {CreateSubSession} 200 - getsubSessions
 */

sessionRouter.get('/sub', controller.getSubSessions);

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

/**
 * GET /sessions/rates
 * @typedef {object} IRates
 * @summary Get Rates
 * @tags sessions
 * @param {string} from.query - Date From Session (YYYY-MM-DD)
 * @param {string} to.query - Date To Session (YYYY-MM-DD)
 * @return {Rates} 200 - getRates
 *
 */

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
