import { User } from '../../entity/User'
import { redis } from '../../redis'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { forgotPasswordPrefix } from '../constants/redisPrefix'
import { ChangePasswordInput } from './Change-Password/changePasswordInput'
import bcyrpt from 'bcryptjs'
import { MyContext } from '../../types/MyContext'
@Resolver()
export class ChangePasswordResolver {
	@Mutation(() => User, { nullable: true })
	async changePassword(
		@Arg('data') { token, password }: ChangePasswordInput,
		@Ctx() ctx: MyContext
	): Promise<User | null> {
		const userId = await redis.get(forgotPasswordPrefix + token)

		if (!userId) {
			return null
		}
		const user = await User.findOne(userId)
		if (!user) {
			return null
		}
		user.password = await bcyrpt.hash(password, 12)
		await user.save()
		await redis.del(forgotPasswordPrefix + token)

		ctx.req.session.userId = user.id

		return user
	}
}
