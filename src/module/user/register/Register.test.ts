import { gCall } from '../../../test/gCall'
import { Connection } from 'typeorm'
import { testConnection } from '../../../test/testConnection'
import { redis } from '../../../redis'
import faker from 'faker'
import { User } from 'src/entity/User'

let connection: Connection

beforeAll(async () => {
	connection = await testConnection()
	if (redis.status === 'end') {
		await redis.connect()
	}
})

afterAll(async () => {
	await connection.close()
	redis.disconnect()
})

const registerMutation = `
mutation Register($data:RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
  }
}
`

describe('Register', () => {
	it('create user', async () => {
		const user = {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		}

		const response = await gCall({
			source: registerMutation,
			variableValues: {
				data: user,
			},
		})
		expect(response).toMatchObject({
			data: {
				register: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
				},
			},
		})
		const dbUser = await User.findOne({ where: { email: user.email } })
		expect(dbUser).toBeDefined()
		expect(dbUser!.confirmed).toBeFalsy()
		expect(dbUser!.firstName).toBe(user.firstName)
	})
})
