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
  sessionId: string;

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
