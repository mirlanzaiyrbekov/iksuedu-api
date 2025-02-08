import { Type } from 'class-transformer'
import {
	IsArray,
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

	@IsString()
	@IsNotEmpty()
	passedScore: string

	questions: QuestionCreateDTO[]
}

export class DefendantCreateDTO {
	@IsString()
	@IsNotEmpty()
	firstName: string

	@IsString()
	@IsNotEmpty()
	lastName: string

	@IsString()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	school: string

	@IsString()
	@IsNotEmpty()
	testId: string
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

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AnswerDTO)
	answers: AnswerDTO[]
}
