import { type NextFunction, type Request } from 'express';
import { type users } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { JwtPayload, type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
// import SessionsService from './sessions.service';
import DashboardService from './dashboard.service';

export default class DashboardController extends Api {
  private readonly dashboardService = new DashboardService();

  public getGenderAgeDist = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.dashboardService.getGenderAgeDist(
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Ok, 'Gender Distribution');
    } catch (e) {
      next(e);
    }
  };
}
