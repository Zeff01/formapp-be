import prisma from '@/lib/prisma';
import { JwtPayload } from '@/types/common.type';
import { UserTypeEnum } from '@prisma/client';

interface IAgeBracket {
  min: number;
  max: number;
}
export default class DashboardService {
  constructor() {}

  public async getGenderAgeDist(user?: JwtPayload) {
    let where: any = {};
    if (user?.id && user?.type === UserTypeEnum.FOUNDER) {
      where.createdBy = user.id;
    }
    //Gender Distribution
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

    //Age Distribution
    //get user birthdates
    const users = await prisma.subSession.findMany({
      where: {
        createdBy: user?.id,
      },
      select: {
        users: {
          select: {
            dateofbirth: true,
          },
        },
      },
    });
    //list date of birth to array of dates
    const dateofbirthList: Date[] = []; //array of dates
    const a = users.forEach((item) => {
      item.users.forEach((user) => {
        if (user.dateofbirth) {
          dateofbirthList.push(user.dateofbirth);
        }
      });
    });

    //calculate ages
    const ages: number[] = dateofbirthList.map(this.calculateBday);

    //declare bracket
    const ageBrackets: IAgeBracket[] = [
      { min: 18, max: 24 },
      { min: 25, max: 34 },
      { min: 35, max: 44 },
      { min: 45, max: 59 },
      { min: 60, max: 100 },
    ];

    //
    const ageBracketSummary = this.summaryAgesByBracket(ages, ageBrackets);

    const genderDist = {
      female: `${Math.round(
        (genderAggregate[0]._count.gender / totalUser) * 100
      )}%`,
      male: `${Math.round(
        (genderAggregate[1]._count.gender / totalUser) * 100
      )}%`,
      total: totalUser,
    };

    const res = {
      genderDist: genderDist,
      ageBracketsVal: ageBracketSummary,
    };
    return res;
  }

  //bday calculator based on today
  private calculateBday(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  private categorizeAgeToBracket(age: number, ageBrackets: IAgeBracket[]) {
    for (const bracket of ageBrackets) {
      if (age >= bracket.min && age <= bracket.max) {
        return `${bracket.min}-${bracket.max}`;
      }
    }
    return 'Unknown';
  }
  private summaryAgesByBracket(
    ages: number[],
    ageBrackets: IAgeBracket[]
  ): Record<string, string> {
    const summary: Record<string, number> = {};

    //Initialize counts for each age bracket
    for (const ageBracket of ageBrackets) {
      summary[`${ageBracket.min}-${ageBracket.max}`] = 0;
    }

    //Count users per age bracket
    for (const age of ages) {
      const bracket = this.categorizeAgeToBracket(age, ageBrackets);
      summary[bracket]++;
    }

    const totalCount = ages.length;

    const percentageSummary: Record<string, string> = {};
    for (const [bracket, count] of Object.entries(summary)) {
      percentageSummary[bracket] = `${((count / totalCount) * 100).toFixed(
        2
      )}%`;
    }

    return percentageSummary;
  }
}
