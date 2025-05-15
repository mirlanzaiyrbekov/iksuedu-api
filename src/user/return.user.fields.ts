import { Prisma } from '@prisma/client'

export const RETURN_USER_PROFILE_FIELDS: Prisma.TeacherSelect = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
}
