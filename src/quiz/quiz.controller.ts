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
import { AuthGuard } from 'src/guards/auth.guard'
import { QuizCreateDTO, QuizResultsDTO, QuizUpdateDTO } from './dto/quiz.dto'
import { QuizService } from './quiz.service'

@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	/**
	 *
	 * @param dto
	 * @description CREATE QUIZ
	 */
	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.CREATED)
	createQuiz(@Body() dto: QuizCreateDTO) {
		return this.quizService.createQuiz(dto)
	}

	/**
	 *
	 * @param dto
	 * @returns UPDATED QUIZ
	 * @description UPDATE QUIZ
	 */
	@Patch(':id')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	updateQuiz(@Body() dto: QuizUpdateDTO) {
		return this.quizService.updateQuiz(dto)
	}

	/**
	 *
	 * @param dto
	 * @description QUIZ PROCESS
	 */
	@Post('process')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
	processedQuiz(@Body() dto: QuizResultsDTO) {
		return this.quizService.processedQuiz(dto)
	}

	/**
	 *
	 * @param id
	 * @returns ONE QUIZ BY ID
	 */
	@Get(':id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findById(@Param('id') id: string) {
		return this.quizService.findById(id)
	}

	@Get('by-url/:url')
	@HttpCode(HttpStatus.OK)
	findByUrl(@Param('url') url: string) {
		return this.quizService.findByUrlToProcessTesting(url)
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
