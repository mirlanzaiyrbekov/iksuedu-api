import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { AnswerCreateDTO, AnswerUpdateDTO } from './answer.dto'

export class QuestionCreateDTO {
	@IsString()
	@IsNotEmpty()
	content: string

	answers: AnswerCreateDTO[]
}

export class QuestionUpdateDTO {
	@IsString()
	id: string

	@IsString()
	@IsOptional()
	content?: string

	@IsOptional()
	answers?: AnswerUpdateDTO[]
}
