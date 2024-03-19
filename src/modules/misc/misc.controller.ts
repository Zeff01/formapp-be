import { type NextFunction, type Request } from 'express';
import Api from '@/lib/api';
import { CustomResponse, JwtPayload } from '@/types/common.type';
import { Feedbacks, Survey, type Faq } from '@prisma/client';
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
  public addFeedback = async (
    req: Request,
    res: CustomResponse<Feedbacks>,
    next: NextFunction
  ) => {
    try {
      const feedbacks = await this.miscService.addFeedback(req.body);
      this.send(res, feedbacks, HttpStatusCode.Created, 'Feedback Added');
    } catch (e) {
      next(e);
    }
  };

  public Survey = async (
    req: Request,
    res: CustomResponse<Survey>,
    next: NextFunction
  ) => {
    try {
      const survey = await this.miscService.SurveyData(req.body);
      this.send(res, survey, HttpStatusCode.Created, 'Survey Added');
    } catch (e) {
      next(e);
    }
  };

  public getSurvey = async (
    req: Request,
    res: CustomResponse<Survey>,
    next: NextFunction
  ) => {
    try {
      const fromDate = req.query.from ? new Date(req.query.from as string) : undefined;
      const toDate = req.query.to ? new Date(req.query.to as string) : undefined;
      const getSurvey = await this.miscService.getAllSurveyData(
        fromDate,
        toDate
      );
      this.send(res, getSurvey, HttpStatusCode.Ok, 'Survey List');
    } catch (e) {
      next(e);
    }
  };
}
