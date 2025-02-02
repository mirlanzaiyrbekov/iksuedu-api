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

	@Get('profile')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	findUserProfile(@UseCurrentUser('email') email: string) {
		return this.userService.findUserProfile(email)
	}
}
