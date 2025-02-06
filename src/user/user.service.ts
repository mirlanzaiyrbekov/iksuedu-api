import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { createUserDTO } from './dto/user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * @param dto [USER DTO]
	 * @description CREATE USER TO DB
	 */
	async create(dto: createUserDTO) {
		try {
			const isExist = await this.findByEmail(dto.email)
			if (!isExist) {
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

	async findByEmail(email: string) {
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

	async findUserProfile(email: string) {
		try {
			const user = await this.prismaService.teacher.findUnique({
				where: {
					email,
				},
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
				},
			})
			if (!user) throw new UnauthorizedException()
			return user
		} catch (error) {
			throw error
		}
	}
}
