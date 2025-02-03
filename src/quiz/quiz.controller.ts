import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
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
	@HttpCode(HttpStatus.CREATED)
	update(@Body() dto: QuizUpdateDTO) {
		return this.quizService.update(dto)
	}

	delete() {}
}
