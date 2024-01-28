import { Router } from 'express';
import MiscController from './misc.controller';
import RequestValidator from '@/middlewares/request-validator';
import { CreateFaqDto, addFeedbackDto } from '@/dto/misc.dto';
import { Feedbacks } from '@prisma/client';
const miscRouter: Router = Router();
const controller = new MiscController();

/**
 * Feedback
 * @typedef {object} Feedback
 * @property {string} id
 * @property {string} experience
 * @property {string} difficultProcess
 * @property {string} rating
 */
/**
 * FAQ
 * @typedef {object} FAQ
 * @property {string} id
 * @property {string} question
 * @property {string} answer
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * GET /misc/faq
 * @tags misc
 * @summary Get FAQ List
 * @returns {FAQ} 200 - FAQ List
 */
miscRouter.get('/faq', controller.getFaq);

/**
 * POST /misc/addfaq
 * @tags misc
 * @summary Add FAQ List for Admin
 * @property {string} question.required
 * @property {string} answer.required
 * @param {CreateFaqDto} request.body.required
 * @return {FAQ} 201 - FAQ Added
 *
 */
miscRouter
  .route('/addfaq')
  .post(RequestValidator.validate(CreateFaqDto), controller.addFaq);
/**
 * POST /misc/addfeedback
 * @typedef {object} addFeedbackDto
 * @tags misc
 * @summary Give Feedback
 * @property {string} experience.required
 * @property {string} difficultProcess.required
 * @property {string} rating.required
 * @param {addFeedbackDto} request.body.required
 * @return {Feedback} 201 - Feedback Added
 */
miscRouter
  .route('/addfeedback')
  .post(RequestValidator.validate(addFeedbackDto), controller.addFeedback);
export default miscRouter;
