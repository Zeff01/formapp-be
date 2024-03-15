import prisma from '@/lib/prisma';
import { CreateFaqDto, addFeedbackDto, SurveyDto } from '@/dto/misc.dto';
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
}
