import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function usersRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const userCollectedByEmail = await knex('users')
      .where({ email: email })
      .first()

    if (userCollectedByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return reply.status(200).send()
  })
}
