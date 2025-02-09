import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { DefendantService } from './defendant.service'
import { DefendantCreateDTO } from './dto/defendant.dto'

@Controller('defendant')
export class DefendantController {
	constructor(private readonly defendantService: DefendantService) {}

	/**
	 *
	 * @param dto
	 * @description REGISTER DEFENDANT
	 */
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe())
	registerDefendant(@Body() dto: DefendantCreateDTO) {
		return this.defendantService.create(dto)
	}

	/**
	 * @description FIND ALL ANSWERS
	 */
	@Get('answers/all')
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	findAllAnswers() {
		return this.defendantService.findAllAnswers()
	}

	/**
	 * @description FIND ANSWER BY ANSWER-ID
	 */
	@Get('answers/:id')
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	findAnswerByAnswerId(@Param('id') id: string) {
		return this.defendantService.findAnswerByAnswerId(id)
	}

	/**
	 * @description FIND ANSWER BY ANSWER-ID
	 */
	@Get('answers/:quizId/:defendantId')
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	findAnswersByQuizId(
		@Param('defendantId') defendantId: string,
		@Param('quizId') quizId: string,
	) {
		return this.defendantService.findAnswers(quizId, defendantId)
	}

	@Get()
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	findAll() {
		return this.defendantService.findAll()
	}

	@Get(':id')
	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	findById(@Param('id') id: string) {
		return this.defendantService.findById(id)
	}
}
