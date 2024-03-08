import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

import { Gender } from '@prisma/client';

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
  clubId: string;

  @IsArray()
  @IsNotEmpty()
  packages: PackageDto[];
}

export class PackageDto {
  @IsString()
  @IsNotEmpty()
  packageName: string;

  @IsArray()
  @ArrayNotEmpty()
  features: string[];

  @IsString()
  @IsNotEmpty()
  monthlyRate: string;

  @IsString()
  @IsNotEmpty()
  yearlyRate: string;
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

export class LoginFounderDto {
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
