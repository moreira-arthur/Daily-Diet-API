import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoute(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        diet: z.enum(['yes', 'no']),
        date: z.coerce.date(),
      })

      const { title, description, diet, date } = createMealBodySchema.parse(
        request.body
      )

      await knex('meals').insert({
        id: randomUUID(),
        title,
        description,
        on_diet: diet === 'yes',
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    }
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .select()
        .orderBy('date', 'desc')

      return reply.send({ meals })
    }
  )
}
