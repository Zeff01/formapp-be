import {
  type Prisma,
  UserTypeEnum,
  type users,
  Gender,
  Clubs,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import {
  CreateClubDto,
  CreateFounderDto,
  CreateUserDto,
  PackageDto,
  LoginFounderDto,
} from '@/dto/user.dto';
import { HttpNotFoundError, HttpUnAuthorizedError } from '@/lib/errors';
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
    // console.log('--------------', data.password);
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
    // console.log(data);
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

  public async generateNumericUniqueId(): Promise<string> {
    let clubId = '';
    let existingClub: Clubs | null;
    do {
      // Generate a random 10-digit number
      const randomNumeric = Math.floor(Math.random() * 9000000000) + 1000000000;
      clubId = `${randomNumeric}`;

      // Check if the generated ID already exists in the database
      existingClub = await prisma.clubs.findFirst({
        where: {
          clubId: clubId,
        },
      });

      // If the ID already exists, generate a new one
    } while (existingClub);

    return clubId;
  }

  public async createClub(data: CreateClubDto, user: JwtPayload) {
    if (user?.type !== UserTypeEnum.FOUNDER) {
      throw new HttpUnAuthorizedError('Forbidden');
    }
    const clubId = await this.generateNumericUniqueId();
    const clubData = {
      clubId: clubId,
      clubName: data.name,
      password: GeneratorProvider.generateHash(data.password),
      packages: {
        create: data.packages.map((packageData) => {
          const monthlyRate = parseFloat(packageData.monthlyRate);
          const yearlyRate = monthlyRate * 12;
          return {
            packageName: packageData.packageName,
            features: { set: packageData.features },
            monthlyRate: monthlyRate,
            yearlyRate: yearlyRate,
          };
        }),
      },
      founderId: user.id, // Assuming Prisma expects a founder object with an id property
    };

    console.log('user type', clubData.founderId);
    console.log('user', user);
    console.log(JSON.stringify(clubData, null, 2));
    return prisma.clubs.create({
      data: clubData,
    });
  }

  public async getClub(clubId: string, clubName: string) {
    return prisma.clubs.findFirst({
      where: {
        OR: [
          {
            clubId: clubId,
          },
          {
            clubName: clubName,
          },
        ],
      },
      select: {
        clubId: true,
        clubName: true,
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
  public async joinGame(subSessionId: string, user: JwtPayload) {
    if (!subSessionId) {
      throw new HttpNotFoundError('Invalid session');
    }
    //update users joinlobby
    return await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        joinedLobbyId: subSessionId,
        updatedAt: new Date(),
      },
    });
  }

  public async joinTeamPerSubSession(teamId: string, user: JwtPayload) {
    if (!teamId) {
      throw new HttpNotFoundError('Invalid team');
    }

    //get subsession from team
    const subSessionId = await prisma.teams.findUnique({
      where: {
        id: teamId,
      },
      select: {
        subSessionId: true,
      },
    });

    //get all team under session id where player was joined
    const teamList = await prisma.teams.findMany({
      where: {
        subSessionId: subSessionId?.subSessionId,
        players: {
          hasSome: [user.id],
        },
      },
      select: {
        id: true,
      },
    });

    //if exist, remove all teams in the list
    const userTeamTobeRemoved: string[] = [];
    teamList.forEach((team) => {
      userTeamTobeRemoved.push(team.id);
    });
    // console.log(0, userTeamTobeRemoved);

    //get all teamId
    const userCurrentTeams = await prisma.users.findMany({
      where: {
        id: user.id,
      },
      select: {
        teamId: true,
      },
    });

    //remove existing teams per sub sesion
    userCurrentTeams.forEach((obj) => {
      obj.teamId = obj.teamId.filter((id) => !userTeamTobeRemoved.includes(id));
    });

    //join to team ID
    userCurrentTeams[0].teamId.push(teamId);

    //update data
    return prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        teamId: userCurrentTeams[0].teamId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePic: true,
      },
    });
  }
}
