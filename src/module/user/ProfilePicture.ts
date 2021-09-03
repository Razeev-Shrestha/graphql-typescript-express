import { Upload } from '../../types/Upload'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { GraphQLUpload } from 'graphql-upload'
import { createWriteStream } from 'fs'

@Resolver()
export class ProfilePictureResolver {
	@Mutation(() => Boolean)
	async addProfilePicture(
		@Arg('picture', () => GraphQLUpload)
		{ createReadStream, filename }: Upload
	): Promise<Boolean> {
		return new Promise(async (resolve, reject) =>
			createReadStream()
				.pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
				.on('finish', () => resolve(true))
				.on('error', () => reject(false))
		)
	}
}

// { '{"query":"mutation AddProfilePicture($picture:Upload!){\n  addProfilePicture(picture:$picture)\n}"}' }
