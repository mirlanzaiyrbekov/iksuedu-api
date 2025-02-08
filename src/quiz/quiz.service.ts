import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import slugify from 'slugify'
import { MessageService } from 'src/message/message.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { QuestionCreateDTO } from './dto/question.dto'
import {
	DefendantCreateDTO,
	QuizCreateDTO,
	QuizResultsDTO,
	QuizUpdateDTO,
} from './dto/quiz.dto'

@Injectable()
export class QuizService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly messageService: MessageService,
	) {}

	async create(dto: QuizCreateDTO) {
		try {
			const slugName = slugify(dto.title, {
				locale: 'ru',
				lower: true,
				trim: true,
				replacement: '-',
			})
			await this.prismaService.quiz.create({
				data: {
					title: dto.title,
					expires: dto.expires,
					url: slugName,
					passedScore: +dto.passedScore,
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
					passedScore: +dto.passedScore,
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

	async createDefendant(dto: DefendantCreateDTO) {
		try {
			const defendant = await this.prismaService.defendant.findUnique({
				where: {
					email: dto.email,
				},
				include: {
					tests: true,
				},
			})

			if (defendant) {
				const hasPassedTest = defendant.tests.some(
					(quiz) => quiz.id === dto.testId,
				)
				if (hasPassedTest) {
					throw new BadRequestException('Вы уже прошли этот тест')
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

					return this.messageService.sendMessageToClient(
						'Тест активен для вас',
						true,
					)
				}
			} else {
				await this.prismaService.defendant.create({
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

				return this.messageService.sendMessageToClient(
					'Тест активен для вас',
					true,
				)
			}
		} catch (error) {
			throw error
		}
	}

	async quizResults(dto: QuizResultsDTO) {
		try {
			const quiz = await this.findById(dto.quizId)

			if (!quiz) throw new BadRequestException('Прохождение теста невозможно.')

			const answersArray = Object.entries(dto.answers).map(
				([questionId, answerId]) => ({ questionId, answerId }),
			)

			const questionsWithCorrectAnswers =
				await this.prismaService.question.findMany({
					where: {
						testId: dto.quizId,
					},
					include: {
						answers: {
							where: {
								isCorrect: true,
							},
						},
					},
				})

			const correctAnswerMap = new Map(
				questionsWithCorrectAnswers.map((q) => [q.id, q.answers[0]?.id]),
			)

			let correctCount = 0

			answersArray.forEach(({ questionId, answerId }) => {
				if (correctAnswerMap.get(questionId) === answerId?.toString()) {
					correctCount++
				}
			})
			const totalQuestions = questionsWithCorrectAnswers.length
			const score = (correctCount / totalQuestions) * 100
			const passed = score >= quiz.passedScore

			await this.prismaService.quiz.update({
				where: { id: dto.quizId },
				data: {
					passed: passed ? quiz.passed + 1 : quiz.passed,
					didNotPass: !passed ? quiz.didNotPass + 1 : quiz.didNotPass,
				},
			})

			return {
				correctAnswers: correctCount,
				totalQuestions,
				score,
				success: true,
				message: 'Тест завершен',
				passed,
			}
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
					passed: true,
					passedScore: true,
					didNotPass: true,
					url: true,
					defendants: true,
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

	async findByUrl(url: string) {
		try {
			const quiz = await this.prismaService.quiz.findUnique({
				where: {
					url,
				},
			})
			const now = new Date()
			if (quiz && quiz.expires < now) {
				throw new BadRequestException('Тест не активен')
			}
			return await this.prismaService.quiz.findUnique({
				where: {
					url,
				},
				select: {
					id: true,
					title: true,
					url: true,
					createdAt: true,
					expires: true,
					defendants: {
						select: {
							id: true,
							email: true,
						},
					},
					teacher: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
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
