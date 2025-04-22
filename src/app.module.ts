import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resources } from './resource'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
		}),
		...resources,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
