import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

import { Gender, UserTypeEnum } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsMobilePhone()
  phone: string;

  @IsDateString()
  dateofbirth: Date;

  @IsString()
  address: string;

  @IsEnum(Gender)
  gender: string;

  @IsUrl()
  profilePic?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateFounderDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsMobilePhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  clubId?: string;
}

export class PackageDto {
  @IsString()
  packageName: string;

  @IsArray()
  features: string[];

  @IsString()
  monthlyRate: string;

  @IsNumber()
  @IsOptional()
  yearlyRate?: number;
}

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @IsMobilePhone()
  phone?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

}

export class ICreateMemberDto {
  @IsString()
  @IsUrl()
  profilePic: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsMobilePhone()
  phone: string;

  @IsDateString()
  dateofbirth: Date;

  @IsString()
  address: string;

  @IsEmail()
  email: string;
}

export class DeleteUserDto {
  @IsEmail()
  email: string;
}

export class JoinGameDto {
  @IsString()
  @IsNotEmpty()
  joinLobbyId: string;
}
