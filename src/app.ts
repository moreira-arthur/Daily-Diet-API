import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { mealsRoute } from './routes/meals'
import { metricsRoute } from './routes/metrics'
import { usersRoute } from './routes/users'

export const app = fastify()

app.register(cookie)

app.register(mealsRoute, {
  prefix: 'meals',
})

app.register(metricsRoute, {
  prefix: 'metrics',
})

app.register(usersRoute, {
  prefix: 'users',
})
