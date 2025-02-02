import { Global, Module } from '@nestjs/common'
import { MessageService } from './message.service'

@Global()
@Module({
	imports: [],
	providers: [MessageService],
	controllers: [],
	exports: [MessageService],
})
export class MessageModule {}
