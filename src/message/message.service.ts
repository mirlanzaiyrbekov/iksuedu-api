import { Injectable } from '@nestjs/common'

@Injectable()
export class MessageService {
	sendMessageToClient(
		message: string,
		success: boolean,
		access_token?: string,
		data?: any,
	) {
		return {
			message,
			success,
			access_token,
			data,
		}
	}
}
