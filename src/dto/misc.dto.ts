import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChannelType, Marketing } from '@prisma/client'; // Assuming Marketing is defined elsewhere

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class addFeedbackDto {
  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsNotEmpty()
  difficultProcess: string;

  @IsString()
  rating: string;
}

export class SurveyDto {
  @IsEnum(Marketing)
  marketing: Marketing;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class BankDto {
  @IsString()
  channelCode: string;

  @IsEnum(ChannelType)
  channelType: ChannelType;

  @IsString()
  bankName: string;
}
