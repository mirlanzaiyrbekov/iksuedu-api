import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { QuizService } from 'src/quiz/quiz.service'
import { AttemptDTO, DefendantCreateDTO } from './dto/defendant.dto'

@Injectable()
export class DefendantService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly messageService: MessageService,
		private readonly quizService: QuizService,
	) {}

	/**
	 *
	 * @param dto
	 * @description REGISTER DEFENDANT
	 */
	async create(dto: DefendantCreateDTO) {
		try {
			// CHECKING IF DEFENDANT ALREADY PASSED THE QUIZ
			await this.checkDefendantQuizProcess(dto.testId, dto.attempt)

			await this.prismaService.quiz.update({
				where: {
					id: dto.testId,
				},
				data: {
					attemp: {
						create: {
							ipAddress: dto.attempt.ipAddress,
							userAgent: dto.attempt.userAgent,
							deviceModel: dto.attempt.deviceModel,
							fingerprint: dto.attempt.fingerprint,
						},
					},
				},
			})

			const defendant = await this.prismaService.defendant.create({
				data: {
					fullName: dto.fullName,
					school: dto.school,
					phone: dto.phone,
					tests: { connect: { id: dto.testId } },
				},
			})

			return this.messageService.sendMessageToClient(
				'Тест активен для вас',
				true,
				undefined,
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
			return await this.prismaService.defendantAnswer.findMany()
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

	/**
	 * @param dto ATTEMPT DTO
	 * @returns BOOLEAN
	 * @description CHECK IF DEFENDANT ALREADY PASSED THE QUIZ
	 */
	private async checkDefendantQuizProcess(quizId: string, dto: AttemptDTO) {
		try {
			const checking = await this.quizService.findById(quizId)
			if (!checking) throw new NotFoundException('Тест не найден')
			const existingAttempt = await this.prismaService.attemp.findFirst({
				where: {
					quizId: quizId,
					fingerprint: dto.fingerprint,
				},
			})
			if (existingAttempt) {
				throw new BadRequestException('Вы уже прошли тестирование')
			}
			return true
		} catch (error) {
			// console.error('Ошибка при проверке попытки:', error.message)
			throw error
		}
	}
}
