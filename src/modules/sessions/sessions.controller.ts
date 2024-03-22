import { type NextFunction, type Request } from 'express';
import { type users } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { JwtPayload, type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import SessionsService from './sessions.service';

export default class SessionsController extends Api {
  private readonly sessionsService = new SessionsService();

  public getSessions = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const fromDate = req.query.from
        ? new Date(req.query.from as string)
        : undefined;
      const toDate = req.query.to
        ? new Date(req.query.to as string)
        : undefined;
      const result = await this.sessionsService.getSessions(
        req.query.id as string,
        fromDate,
        toDate,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Ok, 'Session List');
    } catch (e) {
      next(e);
    }
  };
  public getPlayersPerSubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.getPlayersPerSubSession(
        req.query?.id as string,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Ok, 'Player Game Details');
    } catch (e) {
      next(e);
    }
  };

  public createSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.createSession(
        req.body,
        req.user as JwtPayload
      );

      this.send(res, result, HttpStatusCode.Created, 'Session Created');
    } catch (e) {
      next(e);
    }
  };

  public createSubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.createSubSession(
        req.body,
        req.user as JwtPayload
      );

      this.send(res, result, HttpStatusCode.Created, 'Sub Session Created');
    } catch (e) {
      next(e);
    }
  };

  public updateMainSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.updateMainSession(
        req.body,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Session Updated');
    } catch (e) {
      next(e);
    }
  };

  public deleteMainSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.deleteMainSession(
        req.body,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Session Deleted');
    } catch (e) {
      next(e);
    }
  };

  public updateSubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.updateSubSession(
        req.body,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Sub Session Updated');
    } catch (e) {
      next(e);
    }
  };
  public deleteSubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.deleteSubSession(
        req.body,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Sub Session Deleted');
    } catch (e) {
      next(e);
    }
  };

  public getGamePerSubId = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.getGamePerSubId(
        req.query?.id as string
      );
      this.send(res, result, HttpStatusCode.Ok, 'Game Screen Details');
    } catch (e) {
      next(e);
    }
  };

  public paySubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.paySubSession(
        req.body,
        req.query?.rateId as string
      );
      this.send(res, result, HttpStatusCode.Created, 'Session Payment');
    } catch (e) {
      next(e);
    }
  };

  public paymentCallback = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.paymentCallback(req.body);
      this.send(res, result, HttpStatusCode.Created, 'paymentCallback');
    } catch (e) {
      next(e);
    }
  };
  public getPlayersBySubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.sessionsService.getPlayersBySubSession(
        req.query?.id as string
      );
    } catch (e) {
      next(e);
    }
  };
}
