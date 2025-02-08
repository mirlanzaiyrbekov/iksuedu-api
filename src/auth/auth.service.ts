import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { MessageService } from 'src/message/message.service'
import { UserService } from 'src/user/user.service'
import { SignInDTO, SignUpDTO } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly messageService: MessageService,
		private jwtService: JwtService,
	) {}

	/**
	 *
	 * @param dto
	 * @returns ACCESS TOKEN
	 */
	async signIn(dto: SignInDTO) {
		try {
			const user = await this.userService.findByEmail(dto.email)
			if (!user)
				throw new BadRequestException('Не правильный E-mail или пароль')
			const comparePass = await argon2.verify(user.password, dto.password)
			if (!comparePass)
				throw new BadRequestException('Не правильный E-mail или пароль')
			const payload = { id: user.id, email: user.email }
			const access_token = await this.jwtService.signAsync(payload)
			return this.messageService.sendMessageToClient(
				'Вход выполнен успешно',
				true,
				access_token,
			)
		} catch (error) {
			throw error
		}
	}

	/**
	 * @param dto
	 * @returns MESSAGE
	 * @description REGISTER NEW USER | SIGN UP
	 */
	async signUp(dto: SignUpDTO) {
		try {
			await this.userService.create(dto)
			return this.messageService.sendMessageToClient(
				'Регистрация прошла успешно',
				true,
			)
		} catch (error) {
			throw error
		}
	}
}
