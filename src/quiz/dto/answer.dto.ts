import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AnswerCreateDTO {
	@IsBoolean()
	@IsNotEmpty()
	isCorrect: boolean

	@IsString()
	@IsNotEmpty()
	content: string
}

export class AnswerUpdateDTO {
	@IsString()
	id: string

	@IsBoolean()
	@IsOptional()
	isCorrect?: boolean

	@IsString()
	@IsOptional()
	content?: string
}

export class AnswerDTO {
	@IsString()
	@IsNotEmpty()
	questionId: string

	@IsString()
	@IsNotEmpty()
	answerId: string
}
