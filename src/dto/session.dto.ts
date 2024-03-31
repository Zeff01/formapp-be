import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class IPaySessionDto {
  @IsString()
  @IsNotEmpty()
  subSessionId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ICreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  maxMember: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  teams: string[];
}

export class DeleteSessionDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class TeamsDto {
  @IsString()
  teamName: string;

  @IsString()
  color: string;
}

export class PackagesDto {
  @IsString()
  packageName: string;

  @IsNumber()
  cashRate: number;

  @IsNumber()
  onlineRate: number;

  @IsString()
  packageType: string;

  @IsNumber()
  sessionCount: number;
}
export class CreateSessionDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  sessionDate: string;

  @IsString()
  sessionTime: string;

  @IsString()
  coach: string;

  @IsInt()
  noofTeams: number;

  @IsInt()
  maxPlayers: number;

  @IsInt()
  maxperTeam: number;

  @IsString()
  sessionType: string;

  @IsArray()
  teams: TeamsDto[];

  @IsArray()
  packages: PackagesDto[];

  //TODO Validate Nested
  // @ValidateNested({ each: true })
  // @Type(() => teamsDto)
  // teams: teamsDto[];
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => PackagesDto)
  // packages: PackagesDto[];
}

export class IGameDto {
  @IsString()
  subSessionId: string;
}

export class UpdateMainSession {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  sessionDate: string;

  @IsString()
  sessionTime: string;
}

export class UpdateSubSession {
  @IsString()
  coach: string;

  @IsInt()
  noofTeams: number;

  @IsInt()
  maxPlayers: number;

  @IsInt()
  maxperTeam: number;

  @IsString()
  sessionType: string;
}
export class DeleteSubSessionDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateSubSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  coach: string;

  @IsInt()
  noofTeams: number;

  @IsInt()
  maxPlayers: number;

  @IsInt()
  maxperTeam: number;

  @IsString()
  sessionType: string;
  //TODO Validate Nested
  @IsArray()
  teams: TeamsDto[];
}
