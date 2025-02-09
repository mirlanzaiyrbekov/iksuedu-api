import { IsNotEmpty, IsString } from 'class-validator'

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
