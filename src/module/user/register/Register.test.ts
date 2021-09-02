import { gCall } from '../../../test/gCall'
import { Connection } from 'typeorm'
import { testConnection } from '../../../test/testConnection'
import { redis } from '../../../redis'
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
		console.log(
			await gCall({
				source: registerMutation,
				variableValues: {
					data: {
						firstName: 'john',
						lastName: 'Doe',
						email: 'johndoe@gmail.com',
						password: 'johndoe123',
					},
				},
			})
		)
	})
})
