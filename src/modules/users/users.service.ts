import { UserTypeEnum, type users } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {
  @LogMessage<[users]>({ message: 'test-decorator' })
  public async createUser(data: users) {
    return await prisma.users.create({
      data: {
        ...data,
        type: UserTypeEnum.USER,
      },
    });
  }
}
