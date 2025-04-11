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

    return reply.status(201).send()
  })

  app.get('/', async (_, reply) => {
    const users = await knex('users').select('*')
    return reply.status(200).send({ users })
  })

  app.patch('/login', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const user = await knex('users').where({ name: name, email: email }).first()

    if (!user) {
      return reply.status(401).send({
        error: 'User does not exists',
      })
    }

    let sessionId = request.cookies.sessionId

    if (sessionId !== user.session_id) {
      sessionId = user.session_id

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    } else {
      return reply.status(401).send({
        error: 'You are already logged in!',
      })
    }

    return reply.status(200).send()
  })
}
