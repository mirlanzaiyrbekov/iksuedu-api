import { Prisma } from '@prisma/client'

export const RETURN_QUIZ_OBJECT_FIELDS: Prisma.QuizSelect = {
	id: true,
	title: true,
	createdAt: true,
	expires: true,
	passed: true,
	passedScore: true,
	didNotPass: true,
	url: true,
	defendants: {
		select: {
			id: true,
			answers: true,
			fullName: true,
			phone: true,
			score: true,
			passed: true,
			school: true
		},
		orderBy: {
			score: "desc"
		}
	},
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
}
