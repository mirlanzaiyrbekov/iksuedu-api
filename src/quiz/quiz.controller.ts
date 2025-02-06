import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UseCurrentUser } from 'src/decorators/useCurrentUser'
import { AuthGuard } from 'src/guards/auth.guard'
import { QuizCreateDTO, QuizUpdateDTO } from './dto/quiz.dto'
import { QuizService } from './quiz.service'

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.CREATED)
	create(@Body() dto: QuizCreateDTO) {
		return this.quizService.create(dto)
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	update(@Body() dto: QuizUpdateDTO) {
		return this.quizService.update(dto)
	}

	@Get()
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findAllUserQuiz(@UseCurrentUser('email') email: string) {
		return this.quizService.findAllUserQuiz(email)
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findById(@Param('id') id: string) {
		return this.quizService.findById(id)
	}

	@Get('question/:id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findQuestionById(@Param('id') id: string) {
		return this.quizService.findQuestionById(id)
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	deleteQuiz(@Param('id') id: string) {
		return this.quizService.deleteQuiz(id)
	}

	@Delete('question/:id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	deleteQuestion(@Param('id') id: string) {
		return this.quizService.deleteQuestion(id)
	}

	@Delete('question/answer/:id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	deleteAnswer(@Param('id') id: string) {
		return this.quizService.deleteAnswer(id)
	}
}
