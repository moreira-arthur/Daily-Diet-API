import { timeStamp } from 'node:console'
import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoute(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async request => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where('session_id', sessionId).select()

    return { meals }
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      diet: z.enum(['yes', 'no']),
      date_time: z.string(),
    })

    const { title, description, diet, date_time } = createMealBodySchema.parse(
      request.body
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      title,
      description,
      on_diet: diet === 'yes',
      session_id: sessionId,
      consumed_at: date_time,
    })

    return reply.status(201).send()
  })
}
