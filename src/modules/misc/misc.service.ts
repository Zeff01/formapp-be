import LogMessage from '@/decorators/log-message.decorator';
import prisma from '@/lib/prisma';
import { CreateFaqDto } from '@/dto/misc.dto';
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
}
