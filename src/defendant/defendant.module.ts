import { Module } from '@nestjs/common'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'

@Module({
	imports: [],
	providers: [DefendantService],
	controllers: [DefendantController],
})
export class DefendantModule {}
