import prisma from '@/lib/prisma';
import { JwtPayload } from '@/types/common.type';
import { UserTypeEnum } from '@prisma/client';

export default class DashboardService {
  public async getGenderDistribution(user?: JwtPayload) {
    let where: any = {};
    if (user?.id && user?.type === UserTypeEnum.FOUNDER) {
      where.createdBy = user.id;
    }
    const genderAggregate = await prisma.users.groupBy({
      by: ['gender'],
      where: {
        type: UserTypeEnum.USER,
      },
      _count: {
        gender: true,
      },
      orderBy: {
        gender: 'asc',
      },
    });
    const totalUser = await prisma.users.count({
      where: {
        type: UserTypeEnum.USER,
      },
    });

    const payload = {
      female: Math.round((genderAggregate[0]._count.gender / totalUser) * 100),
      male: Math.round((genderAggregate[1]._count.gender / totalUser) * 100),
      total: totalUser,
    };

    return payload;
  }
}
