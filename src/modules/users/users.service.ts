import { type Prisma, UserTypeEnum, type users, Gender } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import {
  CreateFounderDto,
  CreateUserDto,
  LoginFounderDto,
} from '@/dto/user.dto';
import { HttpNotFoundError } from '@/lib/errors';
import { GeneratorProvider } from '@/lib/bcrypt';
import JwtUtil from '@/lib/jwt';
import { JwtPayload } from '@/types/common.type';

export default class UserService {
  public async getFounderInfo(id: string) {
    return prisma.users.findFirst({
      where: {
        id: id,
        type: UserTypeEnum.FOUNDER,
      },
      include: {
        clubs: true,
        subSession: true,
      },
    });
  }

  public async getMemberInfo(email: string) {
    if (!email) throw new HttpNotFoundError('User not found.');
    return prisma.users.findFirst({
      where: {
        email: email,
        type: UserTypeEnum.USER,
      },
      include: {
        subSession: true,
        payments: true,
      },
    });
  }

  public async login(data: LoginFounderDto) {
    try {
      const isExist = await prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!isExist) {
        throw new HttpNotFoundError('Invalid login');
      }

      const matchPassword = GeneratorProvider.validateHash(
        data.password,
        isExist.password!
      );

      if (!matchPassword) {
        throw new HttpNotFoundError('Invalid login');
      }

      const payload: JwtPayload = {
        id: isExist.id,
        email: isExist.email!,
        type: isExist.type,
      };

      return {
        user: isExist,
        token: JwtUtil.generateToken(payload),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUser(
    data: Prisma.usersWhereInput,
    select?: Prisma.usersSelect
  ) {
    return await prisma.users.findFirst({
      where: data,
      select,
    });
  }

  // @LogMessage<[CreateUserDto]>({ message: 'User Created' })
  public async createUser(data: CreateUserDto) {
    if (!data.password) {
      throw new Error('Password is required');
    }
    return await prisma.users.create({
      data: {
        email: data.email,
        password: GeneratorProvider.generateHash(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateofbirth: data.dateofbirth,
        address: data.address,
        gender: Gender[data.gender],
        profilePic: data.profilePic,
        type: UserTypeEnum.USER,
      },
    });
  }

  @LogMessage<[users]>({ message: 'User Updated' })
  public async updateUser(data: users) {
    const { id, ...updateData } = data;
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }

  // @LogMessage<[CreateUserDto]>({ message: 'User Updated' })
  public async createStaff(data: CreateUserDto) {
    console.log(data);
    return await prisma.users.create({
      data: {
        email: data.email,
        password: GeneratorProvider.generateHash(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateofbirth: data.dateofbirth,
        address: data.address,
        gender: Gender[data.gender],
        profilePic: data.profilePic,
        type: UserTypeEnum.STAFF,
      },
    });
  }

  // @LogMessage<[CreateUserDto]>({ message: 'Founder Updated' })
  public async createFounder(data: CreateFounderDto) {
    if (!data.password) {
      throw new Error('Password is required');
    }
    return await prisma.users.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: GeneratorProvider.generateHash(data.password),
        type: UserTypeEnum.FOUNDER,
      },
    });
  }

  @LogMessage<[users]>({ message: 'User Deleted' })
  public async deleteUser(data: users) {
    const { email } = data;
    if (email === null) {
      throw new Error(`"Email cannot be null"`);
    }
    return await prisma.users.delete({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });
  }
}
