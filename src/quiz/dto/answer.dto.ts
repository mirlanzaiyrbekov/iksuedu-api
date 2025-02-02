import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AnswerDTO {
  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsString()
  @IsNotEmpty()
  content: string;
}
