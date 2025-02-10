import { Type } from 'class-transformer'
import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { AnswerDTO } from './answer.dto'
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

	// @IsNumber()
	// @IsNotEmpty()
	// expireTime: number

	@IsString()
	@IsNotEmpty()
	passedScore: string

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

	// @IsNumber()
	// @IsNotEmpty()
	// expireTime: number

	@IsString()
	@IsNotEmpty()
	passedScore: string

	@IsOptional()
	questions?: QuestionUpdateDTO[]
}

export class QuizResultsDTO {
	@IsString()
	@IsNotEmpty()
	quizId: string

	@IsString()
	@IsNotEmpty()
	defendantId: string

	@ValidateNested({ each: true })
	answers: AnswerDTO
}
