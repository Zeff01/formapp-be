import { Router } from 'express';
import Controller from './dashboard.controller';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAdmintAuthToken, verifyAuthToken } from '@/middlewares/auth';

const dashboardRouter: Router = Router();
const controller = new Controller();

dashboardRouter.get(
  '/gender/dist',
  verifyAdmintAuthToken,
  controller.getGenderAgeDist
);

dashboardRouter.get('/invoices', verifyAuthToken, controller.getInvoices);

dashboardRouter.get(
  '/report',
  verifyAdmintAuthToken,
  controller.getTransactionReport
);
export default dashboardRouter;
