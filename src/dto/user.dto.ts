import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  password: string;
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
