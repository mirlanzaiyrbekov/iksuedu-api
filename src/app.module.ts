import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resources } from './resource'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'production'
					? '.env.production'
					: '.env.development',
			isGlobal: true,
		}),
		...resources,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
