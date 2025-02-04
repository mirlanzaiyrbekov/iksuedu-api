import { Injectable, NotFoundException } from '@nestjs/common'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { QuizCreateDTO, QuizUpdateDTO } from './dto/quiz.dto'

@Injectable()
export class QuizService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly messageService: MessageService,
	) {}

	async create(dto: QuizCreateDTO) {
		try {
			await this.prismaService.quiz.create({
				data: {
					title: dto.title,
					expires: dto.expires,
					teacher: {
						connect: {
							id: dto.teacherId,
						},
					},
					questions: {
						create: dto.questions.map((question) => ({
							content: question.content,
							answers: {
								create: question.answers.map((answer) => ({
									content: answer.content,
									isCorrect: answer.isCorrect,
								})),
							},
						})),
					},
				},
			})
			return this.messageService.sendMessageToClient(
				'Тест успешно создан',
				true,
			)
		} catch (error) {
			throw error
		}
	}
	async update(dto: QuizUpdateDTO) {
		try {
			await this.prismaService.quiz.update({
				where: { id: dto.id },
				data: {
					title: dto.title,
					expires: dto.expires,
					questions: {
						update: dto.questions
							? dto.questions.map((question) => ({
									where: { id: question.id },
									data: {
										content: question.content,
										answers: {
											update: question.answers
												? question.answers.map((answer) => ({
														where: { id: answer.id },
														data: {
															content: answer.content,
															isCorrect: answer.isCorrect,
														},
													}))
												: undefined,
										},
									},
								}))
							: undefined,
					},
				},
			})

			return this.messageService.sendMessageToClient(
				'Тест успешно обновлён',
				true,
			)
		} catch (error) {
			throw error
		}
	}

	async findById(id: string) {
		try {
			return await this.prismaService.quiz.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					title: true,
					createdAt: true,
					expires: true,
					defendant: true,
					teacher: {
						select: {
							id: true,
							firstName: true,
						},
					},
					questions: {
						select: {
							id: true,
							content: true,
							answers: {
								select: {
									id: true,
									content: true,
									isCorrect: true,
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

	async delete(id: string) {
		try {
			const find = await this.findById(id)
			if (!find) throw new NotFoundException('Удаление невозможно!')
			await this.prismaService.quiz.delete({
				where: {
					id,
				},
			})
		} catch (error) {}
	}
}
