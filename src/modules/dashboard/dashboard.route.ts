import { Router } from 'express';
import Controller from './dashboard.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const dashboardRouter: Router = Router();
const controller = new Controller();

dashboardRouter.get(
  '/gender/dist',
  verifyAuthToken,
  controller.getGenderAgeDist
);

dashboardRouter.get('/invoices', verifyAuthToken, controller.getInvoices);

export default dashboardRouter;
