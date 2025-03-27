import { Module } from '@nestjs/common'
import { QuizService } from 'src/quiz/quiz.service'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'

@Module({
	imports: [],
	providers: [DefendantService, QuizService],
	controllers: [DefendantController],
})
export class DefendantModule {}
