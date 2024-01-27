import { type NextFunction, type Request } from 'express';
import Api from '@/lib/api';
import { CustomResponse } from '@/types/common.type';
import { type Faq } from '@prisma/client';
import MiscService from './misc.service';
import { HttpStatusCode } from 'axios';

export default class MiscController extends Api {
  private miscService = new MiscService();

  public getFaq = async (
    req: Request,
    res: CustomResponse<Faq>,
    next: NextFunction
  ) => {
    try {
      const result = await this.miscService.getFaq();
      this.send(res, result, HttpStatusCode.Ok, 'FAQ List');
    } catch (e) {
      next(e);
    }
  };

  public addFaq = async (
    req: Request,
    res: CustomResponse<Faq>,
    next: NextFunction
  ) => {
    try {
      const faq = await this.miscService.addFaq(req.body);
      this.send(res, faq, HttpStatusCode.Created, 'FAQ Added');
    } catch (error) {
      next(error);
    }
  };
}
