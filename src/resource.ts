import { AuthModule } from './auth/auth.module'
import { MessageModule } from './message/message.module'
import { PrismaModule } from './prisma/prisma.module'
import { QuizModule } from './quiz/quiz.module'
import { UserModule } from './user/user.module'

export const resources = [
	PrismaModule,
	QuizModule,
	UserModule,
	AuthModule,
	MessageModule,
]
