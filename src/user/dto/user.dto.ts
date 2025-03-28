import { IsNotEmpty, IsString } from 'class-validator'

export class createUserDTO {
	@IsString()
	@IsNotEmpty()
	firstName: string
	@IsString()
	@IsNotEmpty()
	lastName: string

	@IsString()
	@IsNotEmpty()
	password: string
	@IsString()
	@IsNotEmpty()
	email: string
}
