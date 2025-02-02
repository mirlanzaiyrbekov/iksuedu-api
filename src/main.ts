import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true,
	})
	app.setGlobalPrefix('api/v1', { exclude: ['/'] })
	app.enableCors({
		origin: ['http://localhost:5173'],
		methods: 'GET,POST,PUT,PATCH,HEAD,DELETE',
		credentials: true,
	})
	await app.listen(process.env.PORT ?? 5100)
	console.log(`SERVER has been running on: ${await app.getUrl()}`)
}
bootstrap()
