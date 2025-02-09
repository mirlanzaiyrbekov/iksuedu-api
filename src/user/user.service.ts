import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { createUserDTO } from './dto/user.dto'
import { RETURN_USER_PROFILE_FIELDS } from './return.user.fields'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * @param dto [USER DTO]
	 * @description CREATE USER TO DB
	 */
	async createUser(dto: createUserDTO) {
		try {
			const user = await this.findUserByEmail(dto.email)
			if (!user) {
				const hashed = await argon2.hash(dto.password, { hashLength: 12 })
				return await this.prismaService.teacher.create({
					data: {
						firstName: dto.firstName,
						lastName: dto.lastName,
						email: dto.email,
						password: hashed,
					},
				})
			}
			throw new BadRequestException(
				'Пользователь с таким E-mail уже существует',
			)
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @param email
	 * @returns USER
	 * @description FIND USER BY EMAIL
	 */
	async findUserByEmail(email: string) {
		try {
			return await this.prismaService.teacher.findUnique({
				where: {
					email,
				},
			})
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @param email
	 * @returns USER PROFILE
	 * @description FIND USER PROFILE
	 */
	async findUserProfile(email: string) {
		try {
			const user = await this.prismaService.teacher.findUnique({
				where: {
					email,
				},
				select: RETURN_USER_PROFILE_FIELDS,
			})
			if (!user) throw new UnauthorizedException()
			return user
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @param email
	 * @returns ALL USER QUIZES
	 */
	async findAllUserQuizes(email: string) {
		try {
			return await this.prismaService.quiz.findMany({
				where: {
					teacher: {
						email,
					},
				},
				include: {
					questions: {
						include: {
							answers: true,
						},
					},
				},
			})
		} catch (error) {
			throw error
		}
	}
}
