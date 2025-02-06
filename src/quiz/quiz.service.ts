import { Injectable, NotFoundException } from '@nestjs/common'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { QuestionCreateDTO } from './dto/question.dto'
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
				},
			})

			const quizUpdatePromises: any[] = []
			if (dto.questions) {
				const existingQuestions = dto.questions.filter(
					(question) => question.id,
				)
				const newQuestions: QuestionCreateDTO[] = dto.questions.filter(
					(question) => !question.id,
				) as QuestionCreateDTO[]

				for (const question of existingQuestions) {
					const updateQuestion = this.prismaService.question.update({
						where: { id: question.id },
						data: {
							content: question.content,
							answers: {
								update: question.answers
									? question.answers
											.filter((a) => a.id)
											.map((answer) => ({
												where: { id: answer.id },
												data: {
													content: answer.content,
													isCorrect: answer.isCorrect,
												},
											}))
									: undefined,
								// @ts-ignore
								create: question.answers
									?.filter((a) => !a.id)
									.map((answer) => ({
										content: answer.content,
										isCorrect: answer.isCorrect,
									})),
							},
						},
					})
					quizUpdatePromises.push(updateQuestion)
				}
				if (newQuestions.length) {
					for (const newQuestion of newQuestions) {
						const createQuestion = this.prismaService.question.create({
							data: {
								content: newQuestion.content,
								test: { connect: { id: dto.id } },
								answers: {
									create: newQuestion.answers?.map((answer) => ({
										content: answer.content,
										isCorrect: answer.isCorrect,
									})),
								},
							},
						})
						quizUpdatePromises.push(createQuestion)
					}
				}
			}

			await Promise.all(quizUpdatePromises)
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

	async findAllUserQuiz(email: string) {
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

	async findQuestionById(id: string) {
		try {
			return await this.prismaService.answer.findUnique({
				where: {
					id,
				},
			})
		} catch (error) {
			throw error
		}
	}

	async deleteQuiz(id: string) {
		try {
			const find = await this.findById(id)
			if (!find) throw new NotFoundException('Удаление невозможно!')
			await this.prismaService.quiz.delete({
				where: {
					id,
				},
			})
			return this.messageService.sendMessageToClient(
				'Тест и его вопросы полностью удалены',
				true,
			)
		} catch (error) {
			throw error
		}
	}

	async deleteQuestion(id: string) {
		try {
			const find = await this.prismaService.question.findUnique({
				where: { id },
			})
			if (!find)
				throw new NotFoundException('Удаление невозможно! Запись не найдена')
			await this.prismaService.question.delete({
				where: {
					id,
				},
			})
			return this.messageService.sendMessageToClient('Вопрос удален', true)
		} catch (error) {
			throw error
		}
	}

	async deleteAnswer(id: string) {
		try {
			const find = await this.prismaService.answer.findUnique({ where: { id } })
			if (!find)
				throw new NotFoundException('Удаление невозможно! Запись не найдена')
			await this.prismaService.answer.delete({
				where: {
					id,
				},
			})
			return this.messageService.sendMessageToClient('Ответ удален', true)
		} catch (error) {
			throw error
		}
	}
}
