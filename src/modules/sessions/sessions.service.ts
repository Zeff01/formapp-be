import LogMessage from '@/decorators/log-message.decorator';
import {
  CreateSessionDto,
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
import { sessions, SesssionType } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

export default class SessionsService {
  private readonly xenditService = new XenditService();

  public async getSessions(code?: string, user?: JwtPayload) {
    let where: any = {};
    if (user?.id && user?.type === UserTypeEnum.FOUNDER) {
      where.founderId = user.id;
    }

    if (code) {
      where.code = code;
    }

    return prisma.users.findMany({
      where: where,
      include: {
        payments: true,
      },
    });
  }

  public async createSession(data: CreateSessionDto, user: JwtPayload) {
    // if (user?.type !== UserTypeEnum.FOUNDER) {
    //   throw new HttpUnAuthorizedError('Forbidden');
    // }

    return prisma.sessions.create({
      data: {
        name: data.name,
        location: data.location,
        sessionDate: data.sessionDate,
        sessionTime: data.sessionTime,
        subSession: {
          create: [
            {
              sessionType: SesssionType[data.sessionType],
              coach: data.coach,
              noofTeams: data.noofTeams,
              maxPlayers: data.maxPlayers,
              maxperTeam: data.maxperTeam,

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
  public async getGamePerSubId(data: IGameDto) {
    return prisma.subSession.findFirst({
      where: {
        id: data.subSessionId,
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

  // public async joinGame(data:IGameDto){
  //   return prisma.subSession.update({

  //   })
  // }
  @LogMessage<[IPaySessionDto]>({ message: 'User Updated' })
  public async paySession(data: IPaySessionDto) {
    const isPaymentExist = await prisma.payments.findFirst({
      where: {
        sessionId: data.sessionId,
        email: data.email,
      },
    });

    if (isPaymentExist) {
      throw new HttpNotFoundError('Payment', ['Already paid.']);
    }

    const session = await prisma.sessions.findFirstOrThrow({
      where: {
        id: data.sessionId,
      },
    });

    return this.xenditService.createInvoice({
      amount: session.price,
      currency: 'PHP',
      description: `Paying membership for ${session.name} with amount of ${session.price}`,
      external_id: `${data.sessionId}||${data.email}`,
      success_redirect_url: `${process.env.FE_BASE_URL}/sucess-payment`,
      failure_redirect_url: `${process.env.FE_BASE_URL}/failed-payment`,
      payer_email: data.email,
    });
  }

  @LogMessage<[IInvoiceTransactionOutput]>({
    message: 'New member paid.',
  })
  public async paymentCallback(data: IInvoiceTransactionOutput) {
    console.log(data);
    try {
      if (data.status === 'PAID') {
        const sessionId = data.external_id.split('||')[0];
        const email = data.external_id.split('||')[1];

        const session = await prisma.sessions.findFirstOrThrow({
          where: {
            id: sessionId,
          },
          include: {
            founder: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        });

        const payoutRes = await this.xenditService.createPayout({
          amount: session?.price,
          description: `Receiving ${data.amount} from ${email}`,
          reference_id: `${sessionId}-${email}`,
          channel_properties: {
            account_holder_name: session.founder.email!,
            account_number: session.founder.phone!,
          },
          receipt_notification: {
            email_to: [session.founder.email!],
            email_cc: [
              'marktomarse@gmail.com', // and other staff
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
            amount: data.amount as number,
            status: 'SUCCESS',
            xenditReferenceId: data.id,
            sessionId: sessionId,
            email: email,
            xenditPayoutId: payoutRes.id,
          },
        });
      }
    } catch (error) {
      throw new HttpUnAuthorizedError('Error');
    }
  }

  @LogMessage<[sessions]>({ message: 'Session Deleted' })
  public async deleteSession(data: sessions) {
    const { code } = data;
    if (code === null) {
      throw new Error(`"Session Code cannot be null"`);
    }
    return await prisma.sessions.delete({
      where: {
        code,
      },
      select: {
        code: true,
      },
    });
  }
}
