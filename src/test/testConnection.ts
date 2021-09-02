import { createConnection } from 'typeorm'

export const testConnection = (drop: boolean = false) => {
	return createConnection({
		name: 'default',
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres12345',
		database: 'express_graphql_test',
		synchronize: drop,
		dropSchema: drop,
		entities: [__dirname + '/../entity/*.*'],
	})
}
