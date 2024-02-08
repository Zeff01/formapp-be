import prisma from '@/lib/prisma';
import { CreateFaqDto, addFeedbackDto } from '@/dto/misc.dto';
import { Rating } from '@prisma/client';
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
}
