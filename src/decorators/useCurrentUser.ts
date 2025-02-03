import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Teacher } from '@prisma/client'

export const UseCurrentUser = createParamDecorator(
	(data: keyof Teacher, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		if (!user) {
			console.error('User is undefined in System!')
			return
		}
		return data ? user[data] : user
	},
)
