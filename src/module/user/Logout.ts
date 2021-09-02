import { MyContext } from 'src/types/MyContext'
import { Ctx, Mutation, Resolver } from 'type-graphql'

@Resolver()
export class LogoutResolver {
	@Mutation(() => Boolean)
	async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
		return new Promise((resolve, reject) =>
			ctx.req.session.destroy(err => {
				if (err) {
					console.error(err)
					return reject(false)
				}
				ctx.res.clearCookie('qid')
				resolve(true)
			})
		)
	}
}
