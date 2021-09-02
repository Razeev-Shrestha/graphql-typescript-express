import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import ExpressPlaygroundMiddleware from 'graphql-playground-middleware-express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'

import { createConnection } from 'typeorm'
import { redis } from './redis'
import { createSchema } from './utils/createSchema'

const mainFunction = async () => {
	await createConnection()
	const schema = await createSchema()
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
	})

	const app = express()
	const RedisStore = connectRedis(session)

	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000',
		})
	)

	app.use(
		session({
			store: new RedisStore({
				client: redis as any,
			}),
			name: 'qid',
			secret: 'rajeev-shrestha',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
			},
		})
	)

	await apolloServer.start()
	apolloServer.applyMiddleware({ app })

	app.get('/playground', ExpressPlaygroundMiddleware({ endpoint: '/graphql' }))

	app.listen(5050, () => {
		console.log(`Server is running on http://localhost:5050`)
	})
	console.log(__dirname)
}

mainFunction()
