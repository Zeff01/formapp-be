import { type Prisma, UserTypeEnum, type users } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {
  public async getUser(
    data: Prisma.usersWhereInput,
    select?: Prisma.usersSelect
  ) {
    return await prisma.users.findFirst({
      where: data,
      select,
    });
  }

  @LogMessage<[users]>({ message: 'User Created' })
  public async createUser(data: users) {
    return await prisma.users.create({
      data: {
        ...data,
        type: UserTypeEnum.USER,
      },
    });
  }

  @LogMessage<[users]>({ message: 'User Updated' })
  public async updateUser(data: users) {
    return await prisma.users.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        type: UserTypeEnum.USER,
      },
    });
  }
}
