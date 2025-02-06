import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { QuestionCreateDTO, QuestionUpdateDTO } from './question.dto'

export class QuizCreateDTO {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	teacherId: string

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	expires: Date

	@IsNotEmpty()
	@IsString()
	urlAddress: string

	questions: QuestionCreateDTO[]
}

export class QuizUpdateDTO {
	@IsString()
	id: string

	@IsString()
	@IsOptional()
	title?: string

	@IsDate()
	@Type(() => Date)
	@IsOptional()
	expires: Date

	@IsOptional()
	questions?: QuestionUpdateDTO[]
}
