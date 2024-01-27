import { Router } from 'express';
import MiscController from './misc.controller';
import RequestValidator from '@/middlewares/request-validator';
import { CreateFaqDto } from '@/dto/misc.dto';
const miscRouter: Router = Router();
const controller = new MiscController();
/**
 * GET /misc/faq
 * @tags misc
 */
miscRouter.get('/faq', controller.getFaq);
/**
 * POST /misc/addfaq
 * @tags misc
 *
 */
miscRouter
  .route('/addfaq')
  .post(RequestValidator.validate(CreateFaqDto), controller.addFaq);
export default miscRouter;
