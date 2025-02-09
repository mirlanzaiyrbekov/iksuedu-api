import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	UseGuards,
} from '@nestjs/common'
import { UseCurrentUser } from 'src/decorators/useCurrentUser'
import { AuthGuard } from 'src/guards/auth.guard'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 *
	 * @param email
	 * @returns USER PROFILE
	 */
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	findUserProfile(@UseCurrentUser('email') email: string) {
		return this.userService.findUserProfile(email)
	}

	/**
	 *
	 * @param email
	 * @returns ALL USER QUIZES
	 */
	@Get()
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findAllUserQuiz(@UseCurrentUser('email') email: string) {
		return this.userService.findAllQuizes(email)
	}
}
