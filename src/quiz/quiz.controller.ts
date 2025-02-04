import {
	Body,
	Controller,
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

	@Get(':id')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	findById(@Param('id') id: string) {
		return this.quizService.findById(id)
	}
	delete() {}
}
