import { IsNotEmpty, IsString } from 'class-validator'
export class AttemptDTO {
	@IsString()
	@IsNotEmpty()
	ipAddress: string

	@IsString()
	@IsNotEmpty()
	userAgent: string

	@IsString()
	@IsNotEmpty()
	deviceModel: string

	@IsString()
	@IsNotEmpty()
	fingerprint: string

	@IsString()
	@IsNotEmpty()
	defendantId: string
}
export class DefendantCreateDTO {
	@IsString()
	@IsNotEmpty()
	fullName: string

	@IsString()
	@IsNotEmpty()
	school: string

	@IsString()
	@IsNotEmpty()
	phone: string

	@IsString()
	@IsNotEmpty()
	testId: string

	attempt: AttemptDTO
}
