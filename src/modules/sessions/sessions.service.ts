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
    from?: Date,
    to?: Date,
    user?: JwtPayload
  ) {
    let where: any = {};
    if (user?.id && user?.type === UserTypeEnum.FOUNDER) {
      where.createdBy = user.id;
    }

    where.status = {
      not: RecordStatus.DELETED,
    };

    if (from && to) {
      const fromDateStr = from.toISOString().split('T')[0];
      const toDateStr = to.toISOString().split('T')[0];
      where.sessionDate = { gte: fromDateStr, lte: toDateStr };
    }
    return await prisma.sessions.findMany({
      where: where,
      include: {
        subSession: {
          select: {
            id: true,
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
          where: {
            status: {
              not: RecordStatus.DELETED,
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
  public async paySubSession(data: IPaySessionDto, rateId: string) {
    const isPaymentExist = await prisma.payments.findFirst({
      where: {
        subSessionId: data.subSessionId,
        email: data.email,
      },
    });

    if (isPaymentExist) {
      throw new HttpNotFoundError('Payment', ['Already paid.']);
    }

    const subSessionType = await prisma.subSession.findFirst({
      where: {
        id: data.subSessionId,
      },
      select: {
        sessionType: true,
      },
    });
    // get rates per sub
    const rates = await prisma.rates.findFirst({
      where: {
        id: rateId,
      },
      select: {
        onlineRate: true,
        sessionCount: true,
        sessions: {
          select: {
            name: true,
          },
        },
      },
    });

    if (rates?.onlineRate) {
      return this.xenditService.createInvoice({
        amount: rates!.onlineRate,
        currency: 'PHP',
        description: `Paying membership for ${rates?.sessions.name} | ${subSessionType?.sessionType} with amount of ${rates?.onlineRate}`,
        external_id: `${data.subSessionId}||${data.email}`,
        success_redirect_url: `${process.env.FE_BASE_URL}/sucess-payment`,
        failure_redirect_url: `${process.env.FE_BASE_URL}/failed-payment`,
        payer_email: data.email,
      });
      //TODO save invoices to db
    }
    return false;
  }

  // @LogMessage<[IInvoiceTransactionOutput]>({
  //   message: 'New member paid.',
  // })
  public async paymentCallback(data: IInvoiceTransactionOutput) {
    console.log(data);
    try {
      if (data.status === 'PAID') {
        const subSessionId = data.external_id.split('||')[0];
        const email = data.external_id.split('||')[1];

        const subSession = await prisma.subSession.findFirstOrThrow({
          where: {
            id: subSessionId,
          },
          select: {
            createdBy: true,
          },
        });

        if (subSession.createdBy) {
          const founderInfo = await prisma.users.findFirstOrThrow({
            where: {
              id: subSession.createdBy,
            },
            select: {
              email: true,
              phone: true,
            },
          });

          const payoutRes = await this.xenditService.createPayout({
            amount: data?.paid_amount,
            description: `Receiving ${data.paid_amount} from ${email}`,
            reference_id: `PO-${subSessionId}-${email}`,
            channel_properties: {
              account_holder_name: founderInfo.email!,
              account_number: founderInfo.phone!,
            },
            receipt_notification: {
              email_to: [founderInfo.email!],
              email_cc: [
                // 'marktomarse@gmail.com', // and other
                'fjab.dev@gmail.com',
                //TODO staff email here
              ],
            },
          });

          if (payoutRes.status !== 'ACCEPTED') {
            throw new HttpBadRequestError('Xendit payout error', [
              'Payout for founder error.',
            ]);
          }

          return prisma.payments.create({
            data: {
              amount: data.paid_amount as number,
              status: 'SUCCESS',
              xenditReferenceId: data.id,
              subSessionId: subSessionId,
              email: email,
              xenditPayoutId: payoutRes.id,
            },
          });
        } else {
          throw new HttpNotFoundError('Payment', ['User info not found']);
        }
      }
    } catch (error) {
      throw new HttpUnAuthorizedError('Error');
    }
  }
  public async getPlayersBySubSession(subSessionId: string) {
    if (!subSessionId)
      throw new HttpBadRequestError('Get Players', [
        'Sub Session Id is undefined',
      ]);
    try {
      let invoiceList: any;
      //get invoice list per sub session id chain
      await this.xenditService.getInvoices().then((invoices) => {
        invoiceList = invoices.filter((invoice: any) =>
          invoice.external_id.includes(subSessionId)
        );
      });
      //extract data to remove unnecessary fields
      const data = invoiceList.map((invoice: any) => ({
        id: invoice.id,
        external_id: invoice.external_id,
        payment_method: invoice.payment_method,
        status: invoice.status,
        amount: invoice.amount,
        paid_amount: invoice.paid_amount,
        paid_at: invoice.paid_at,
        payer_email: invoice.payer_email,
        description: invoice.description,
        created: invoice.created,
        updated: invoice.updated,
        currency: invoice.currency,
      }));
      //get payer email list
      const payer_emails: string[] = data.map(
        (payment: any) => payment.payer_email
      );
      // get users per email list
      const users = await prisma.users.findMany({
        where: {
          email: {
            in: payer_emails,
          },
        },
        select: {
          firstName: true,
          lastName: true,
          profilePic: true,
          email: true,
          payments: true,
        },
      });

      const finalData = users.map((user) => {
        const userPayments = data.find(
          (payment: any) => payment.payer_email === user.email
        );
        return { ...user, payments: userPayments };
      });
      return finalData;
    } catch (error) {
      throw new HttpUnAuthorizedError('Error');
    }
  }

  public async getRates(from?: Date, to?: Date) {
    try {
      let where: any = {};

      if (from && to) {
        where.createdAt = { gte: from, lte: to };

        return await prisma.rates.findMany({
          where,
        });
      } else {
        return await prisma.rates.findMany();
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
