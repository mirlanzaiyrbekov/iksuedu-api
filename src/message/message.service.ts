import { Injectable } from '@nestjs/common'

@Injectable()
export class MessageService {
	sendMessageToClient(
		message: string,
		success: boolean,
		access_token?: string,
	) {
		return {
			message,
			success,
			access_token,
		}
	}
}
