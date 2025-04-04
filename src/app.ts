import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { mealsRoute } from './routes/meals'
import { usersRoute } from './routes/users'

export const app = fastify()

app.register(cookie)

app.register(mealsRoute, {
  prefix: 'meals',
})

app.register(usersRoute, {
  prefix: 'users'
})
