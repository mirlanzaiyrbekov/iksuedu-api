import { IsNotEmpty, IsString } from 'class-validator';
import { AnswerDTO } from './answer.dto';

export class QuestionDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  answer: AnswerDTO[];
}
