import { randomUUID } from 'node:crypto'
import fastify from 'fastify'
import { knex } from './database'

export const app = fastify()

app.get('/hello', async () => {
  const meal = await knex('meals').insert({
    id: randomUUID(),
    title: 'First Meal',
    description: 'Diet coke',
    on_diet: true,
  })
})

app.get('/select', async () => {
  const meal = await knex('meals').select('*')

  return meal
})
