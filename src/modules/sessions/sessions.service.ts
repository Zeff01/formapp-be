import LogMessage from '@/decorators/log-message.decorator';
import {
  CreateSessionDto,
  CreateSubSessionDto,
  ICreateSessionDto,
  IGameDto,
  IPaySessionDto,
} from '@/dto/session.dto';
import XenditService from './xendit.service';
import {
  HttpBadRequestError,
  HttpNotFoundError,
  HttpUnAuthorizedError,
} from '@/lib/errors';
import { IInvoiceTransactionOutput } from '@/dto/xendit.dto';
import { JwtPayload } from '@/types/common.type';
import { UserTypeEnum } from '.prisma/client';
import prisma from '@/lib/prisma';
import {
  sessions,
  SesssionType,
  RecordStatus,
  subSession,
} from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

export default class SessionsService {
  private readonly xenditService = new XenditService();

  public async getSessions(
    id: string,
    from: string,
    to: string,
    user?: JwtPayload
  ) {
    let where: any = {};
    if (user?.id && user?.type === UserTypeEnum.FOUNDER) {
      where.createdBy = user.id;
    }
    if (from && to) where.sessionDate = { gte: from, lte: to };
    console.log(where);
    return await prisma.sessions.findMany({
      where: where,
      include: {
        subSession: {
          select: {
            sessionType: true,
            coach: true,
            noofTeams: true,
            maxPlayers: true,
            maxperTeam: true,
            status: true,
            _count: {
              select: { users: true },
            },
          },
        },
      },
    });
  }
  public async getPlayersPerSubSession(
    subSessionId?: string,
    user?: JwtPayload
  ) {
    //TODO will edit to consider per teams, not per subsession
    if (!subSessionId) {
      throw new HttpUnAuthorizedError('Forbidden');
    }
    return await prisma.users.findMany({
      where: {
        joinedLobbyId: subSessionId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        address: true,
        //TODO include payment column
      },
    });
  }

  public async createSession(data: CreateSessionDto, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    return await prisma.sessions.create({
      data: {
        name: data.name,
        location: data.location,
        sessionDate: data.sessionDate,
        sessionTime: data.sessionTime,
        createdBy: user.id,
        subSession: {
          create: [
            {
              sessionType: SesssionType[data.sessionType],
              coach: data.coach,
              noofTeams: data.noofTeams,
              maxPlayers: data.maxPlayers,
              maxperTeam: data.maxperTeam,
              createdBy: user.id,
              teams: {
                createMany: {
                  data: data.teams,
                },
              },
            },
          ],
        },
        rates: {
          createMany: {
            data: data.packages,
          },
        },
      },
      include: {
        subSession: {
          include: {
            teams: true,
          },
        },
        rates: true,
      },
    });
  }

  public async createSubSession(data: CreateSubSessionDto, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    return await prisma.subSession.create({
      data: {
        sessionId: data.sessionId,
        coach: data.coach,
        noofTeams: data.noofTeams,
        maxperTeam: data.maxperTeam,
        maxPlayers: data.maxPlayers,
        sessionType: SesssionType[data.sessionType],
        createdBy: user.id,
        teams: {
          createMany: {
            data: data.teams,
          },
        },
      },
      include: {
        teams: true,
      },
    });
  }

  public async updateMainSession(data: sessions, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    const { id, ...updatedData } = data;
    return await prisma.sessions.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
        updatedAt: new Date(),
      },
    });
  }
  public async deleteMainSession(data: sessions, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    const { id } = data;
    return await prisma.sessions.update({
      where: {
        id,
      },
      data: {
        status: RecordStatus.DELETED,
      },
    });
  }
  public async deleteSubSession(data: subSession, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    const { id } = data;
    return await prisma.subSession.update({
      where: {
        id,
      },
      data: {
        status: RecordStatus.DELETED,
      },
    });
  }

  public async updateSubSession(data: subSession, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }

    const { id, ...updatedData } = data;
    return await prisma.subSession.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
        status: RecordStatus.ACTIVE,
      },
    });
  }
  public async getGamePerSubId(subSessionId?: string) {
    return await prisma.subSession.findFirst({
      where: {
        id: subSessionId,
      },
      include: {
        sessions: {
          select: {
            id: true,
            name: true,
            location: true,
            sessionDate: true,
            sessionTime: true,
          },
        },
        teams: {
          select: {
            id: true,
            teamName: true,
            color: true,
            subSessionId: true,
            users: {
              select: {
                id: true,
                profilePic: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: { users: true },
            },
          },
        },
        users: {
          select: {
            id: true,
            profilePic: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // @LogMessage<[IPaySessionDto]>({ message: 'User Updated' })
  // public async paySession(data: IPaySessionDto) {
  //   const isPaymentExist = await prisma.payments.findFirst({
  //     where: {
  //       sessionId: data.sessionId,
  //       email: data.email,
  //     },
  //   });

  //   if (isPaymentExist) {
  //     throw new HttpNotFoundError('Payment', ['Already paid.']);
  //   }

  //   const session = await prisma.sessions.findFirstOrThrow({
  //     where: {
  //       id: data.sessionId,
  //     },
  //   });

  //   return this.xenditService.createInvoice({
  //     amount: session.price,
  //     currency: 'PHP',
  //     description: `Paying membership for ${session.name} with amount of ${session.price}`,
  //     external_id: `${data.sessionId}||${data.email}`,
  //     success_redirect_url: `${process.env.FE_BASE_URL}/sucess-payment`,
  //     failure_redirect_url: `${process.env.FE_BASE_URL}/failed-payment`,
  //     payer_email: data.email,
  //   });
  // }

  // @LogMessage<[IInvoiceTransactionOutput]>({
  //   message: 'New member paid.',
  // })
  // public async paymentCallback(data: IInvoiceTransactionOutput) {
  //   console.log(data);
  //   try {
  //     if (data.status === 'PAID') {
  //       const sessionId = data.external_id.split('||')[0];
  //       const email = data.external_id.split('||')[1];

  //       const session = await prisma.sessions.findFirstOrThrow({
  //         where: {
  //           id: sessionId,
  //         },
  //         include: {
  //           founder: {
  //             select: {
  //               email: true,
  //               phone: true,
  //             },
  //           },
  //         },
  //       });

  //       const payoutRes = await this.xenditService.createPayout({
  //         amount: session?.price,
  //         description: `Receiving ${data.amount} from ${email}`,
  //         reference_id: `${sessionId}-${email}`,
  //         channel_properties: {
  //           account_holder_name: session.founder.email!,
  //           account_number: session.founder.phone!,
  //         },
  //         receipt_notification: {
  //           email_to: [session.founder.email!],
  //           email_cc: [
  //             'marktomarse@gmail.com', // and other staff
  //           ],
  //         },
  //       });

  //       if (payoutRes.status !== 'ACCEPTED') {
  //         throw new HttpBadRequestError('Xendit payout error', [
  //           'Payout for founder error.',
  //         ]);
  //       }

  //       return prisma.payments.create({
  //         data: {
  //           amount: data.amount as number,
  //           status: 'SUCCESS',
  //           xenditReferenceId: data.id,
  //           sessionId: sessionId,
  //           email: email,
  //           xenditPayoutId: payoutRes.id,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     throw new HttpUnAuthorizedError('Error');
  //   }
  // }

  // @LogMessage<[sessions]>({ message: 'Session Deleted' })
  // public async deleteSession(data: sessions) {
  //   const { code } = data;
  //   if (code === null) {
  //     throw new Error(`"Session Code cannot be null"`);
  //   }
  //   return await prisma.sessions.delete({
  //     where: {
  //       code,
  //     },
  //     select: {
  //       code: true,
  //     },
  //   });
  // }
}
