import { BadRequestException, Injectable } from '@nestjs/common'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { DefendantCreateDTO } from './dto/defendant.dto'

@Injectable()
export class DefendantService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly messageService: MessageService,
	) {}

	async create(dto: DefendantCreateDTO) {
		try {
			let defendant = await this.prismaService.defendant.findUnique({
				where: {
					email: dto.email,
				},
				include: {
					tests: true,
				},
			})

			if (defendant && defendant.tests.some((quiz) => quiz.id === dto.testId)) {
				throw new BadRequestException('Вы уже прошли этот тест')
			}
			const testExists = await this.prismaService.quiz.findUnique({
				where: { id: dto.testId },
				select: { id: true },
			})
			if (!testExists) {
				throw new BadRequestException('Тест не актуален')
			}
			if (!defendant) {
				// @ts-ignore
				defendant = await this.prismaService.defendant.create({
					data: {
						email: dto.email,
						firstName: dto.firstName,
						lastName: dto.lastName,
						school: dto.school,
						tests: {
							connect: {
								id: dto.testId,
							},
						},
					},
				})
			} else {
				await this.prismaService.defendant.update({
					where: { email: dto.email },
					data: {
						tests: {
							connect: {
								id: dto.testId,
							},
						},
					},
				})
			}
			return this.messageService.sendMessageToClient(
				'Тест активен для вас',
				true,
				undefined,
				// @ts-ignore
				defendant.id,
			)
		} catch (error) {
			throw error
		}
	}

	/**
	 * @description FIND ALL DEFENDANTS
	 */
	async findAll() {
		try {
			return await this.prismaService.defendant.findMany({
				include: {
					tests: {
						select: {
							title: true,
							questions: {
								select: {
									content: true,
									defendantAnswers: {
										select: {
											id: true,
											answer: true,
										},
									},
								},
							},
						},
					},
				},
			})
		} catch (error) {
			throw error
		}
	}

	/**
	 * @description FIND ONE DEFENDANT BY ID
	 */
	async findById(id: string) {
		try {
			return await this.prismaService.defendant.findUnique({
				where: { id },
			})
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @description FIND ALL ANSWERS
	 */
	async findAllAnswers() {
		try {
			return await this.prismaService.defendantAnswer.findMany({})
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @param answerId
	 * @description FIND ANSWER BY ANSWER ID
	 */
	async findAnswerByAnswerId(answerId: string) {
		try {
			return await this.prismaService.defendantAnswer.findUnique({
				where: { id: answerId },
				include: {
					answer: true,
					defendant: true,
					question: {
						include: {
							answers: true,
						},
					},
					quiz: true,
				},
			})
		} catch (error) {
			throw error
		}
	}

	/**
	 *
	 * @param QUIZID
	 * @param DEFENDANTID
	 * @returns ANSWERS QUIZ
	 */
	async findAnswers(quizId: string, defendantId: string) {
		try {
			return await this.prismaService.defendantAnswer.findMany({
				where: { quizId, defendantId },
				include: {
					quiz: true,
					question: {
						include: {
							answers: true,
						},
					},
					answer: true,
				},
			})
		} catch (error) {
			throw error
		}
	}
}
