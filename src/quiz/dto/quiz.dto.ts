import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { QuestionDTO } from './question.dto';

export class QuizDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsDate()
  expires: Date;

  questions: QuestionDTO[];
}
