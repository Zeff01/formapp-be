import prisma from '@/lib/prisma';
import {
  CreateFaqDto,
  addFeedbackDto,
  SurveyDto,
  BankDto,
} from '@/dto/misc.dto';
import { Rating, Marketing } from '@prisma/client';
import { JwtPayload } from '@/types/common.type';
import { HttpUnAuthorizedError } from '@/lib/errors';
export default class MiscService {
  public async getFaq() {
    return await prisma.faq.findMany();
  }

  public async addFaq(data: CreateFaqDto) {
    return await prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
      },
    });
  }
  // return await prisma.feedbacks.create({
  public async addFeedback(data: addFeedbackDto) {
    return await prisma.feedbacks.create({
      data: {
        experience: data.experience,
        difficultProcess: data.difficultProcess,
        rating: data.rating as Rating,
      },
    });
  }

  public async SurveyData(data: SurveyDto) {
    try {
      return await prisma.survey.create({
        data: {
          marketing: data.marketing,
          userId: data.userId,
        },
      });
    } catch (error) {
      throw new HttpUnAuthorizedError('Error');
    }
  }

  public async getAllSurveyData(from?: Date, to?: Date) {
    let whereClause: any = {};

    if (!from && !to) {
      try {
        return await prisma.survey.groupBy({
          by: ['marketing'],
          _count: {
            _all: true,
          },
        });
      } catch (error) {
        throw new Error(error);
      }
    }

    if (from && to) {
      whereClause.createdAt = {
        gte: from,
        lte: to,
      };

      try {
        return await prisma.survey.groupBy({
          by: ['marketing'],
          _count: {
            _all: true,
          },
          where: whereClause,
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  public async addBankCoverage(data: BankDto) {
    try {
      return await prisma.bank.create({
        data: {
          channelCode: data.channelCode,
          channelType: data.channelType,
          bankName: data.bankName,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
