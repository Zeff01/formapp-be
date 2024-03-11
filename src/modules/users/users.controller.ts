import { type NextFunction, type Request } from 'express';
import { Clubs, type users } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './users.service';
import XenditService from '../sessions/xendit.service';
import { JwtPayload, type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();
  private readonly xenditService = new XenditService();
  public createUser = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      this.send(
        res,
        user,
        HttpStatusCode.Created,
        'Player Successfully Created'
      );
    } catch (e) {
      next(e);
    }
  };

  public login = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.login(req.body);
      this.send(res, user, HttpStatusCode.Created, 'login');
    } catch (e) {
      next(e);
    }
  };

  public updateUser = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.updateUser(req.body);
      this.send(res, user, HttpStatusCode.Created, 'User Updated');
    } catch (e) {
      next(e);
    }
  };

  public createStaff = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const user = await this.userService.createStaff(req.body);
      this.send(
        res,
        user,
        HttpStatusCode.Created,
        'Staff Successfully Created'
      );
    } catch (e) {
      next(e);
    }
  };

  public getMemberInfo = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getMemberInfo(
        req.query?.email as string
      );
      this.send(res, user, HttpStatusCode.Created, 'getMemberInfo');
    } catch (e) {
      next(e);
    }
  };

  public createFounder = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createFounder(req.body);
      this.send(
        res,
        user,
        HttpStatusCode.Created,
        'Founder Successfully Created'
      );
    } catch (e) {
      next(e);
    }
  };

  public createClub = async (
    req: Request,
    res: CustomResponse<Clubs>,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.createClub(
        req.body,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Club Created');
    } catch (e) {
      next(e);
    }
  };

  public getClub = async (
    req: Request,
    res: CustomResponse<Clubs>,
    next: NextFunction
  ) => {
    try {
     
      const club = await this.userService.getClub(
        req.query.clubName as string,
      );
      this.send(res, club, HttpStatusCode.Ok, 'Get Club');
    } catch (e) {
      next(e);
    }
  };

  public getFounderInfo = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getFounderInfo(
        req.user?.id as string
      );
      this.send(res, user, HttpStatusCode.Created, 'getFounderInfo');
    } catch (e) {
      next(e);
    }
  };

  public deleteUser = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.deleteUser(req.body);
      this.send(res, user, HttpStatusCode.Ok, 'User Deleted Successfully');
    } catch (e) {
      next(e);
    }
  };
  public joinGame = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.joinGame(
        req.query?.id as string,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Join Successfully');
    } catch (e) {
      next(e);
    }
  };
  public joinTeamPerSubSession = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.joinTeamPerSubSession(
        req.query?.id as string,
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Join Team Successfully');
    } catch (e) {
      next(e);
    }
  };
  public getPlayerById = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.getPlayerById(
        req.user as JwtPayload
      );
      this.send(res, result, HttpStatusCode.Created, 'Player Info');
    } catch (e) {
      next(e);
    }
  };
  public createCustomerXendit = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.xenditService.createCustomer(req.body);
      this.send(
        res,
        result,
        HttpStatusCode.Created,
        'Customer Created in Xendit'
      );
    } catch (e) {
      next(e);
    }
  };
  public createRecurringPlan = async (
    req: Request,
    res: CustomResponse<users>,
    next: NextFunction
  ) => {
    try {
      const result = await this.xenditService.createRecurringPlan(req.body);
      this.send(res, result, HttpStatusCode.Created, 'Plan Created');
    } catch (e) {
      next(e);
    }
  };
}
