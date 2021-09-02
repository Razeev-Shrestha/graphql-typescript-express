import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import bcyrpt from 'bcryptjs'
import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'
import { isAuth } from '../middleware/isAuth'
import { logger } from '../middleware/logger'
import { sendMail } from '../utils/sendEmail'
import { createConfirmationUrl } from '../utils/createConfirmationUrl'

@Resolver()
export class RegisterResolver {
	@UseMiddleware(isAuth, logger)
	@Query(() => String)
	async hello() {
		return 'Hello World'
	}

	@Mutation(() => User)
	async register(
		@Arg('data') { email, firstName, lastName, password }: RegisterInput
	): Promise<User> {
		const hashedPassword = await bcyrpt.hash(password, 12)

		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		}).save()

		await sendMail(email, await createConfirmationUrl(user.id))
		return user
	}
}
