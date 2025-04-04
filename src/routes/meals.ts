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

  app.get(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          user_id: request.user?.id,
          id: mealId,
        })
        .select()

      if (meal.length === 0) {
        return reply.status(404).send({
          error: 'Resource not found',
          message: 'No entity found with the given ID',
        })
      }
      return {
        meal,
      }
    }
  )

  app.put(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const updateMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        diet: z.enum(['yes', 'no']),
        date: z.coerce.date(),
      })

      const { mealId } = updateMealParamsSchema.parse(request.params)

      const { title, description, diet, date } = updateMealBodySchema.parse(
        request.body
      )

      const res = await knex('meals')
        .where({
          user_id: request.user?.id,
          id: mealId,
        })
        .update({
          title,
          description,
          on_diet: diet === 'yes',
          date: date.getTime(),
        })

      if (!res) {
        return reply.status(404).send({
          error: 'Resource not found',
          message: 'No entity found with the given ID',
        })
      }

      reply.status(204).send()
    }
  )

  app.delete(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealsParamsSchema.parse(request.params)

      const res = await knex('meals')
        .where({
          user_id: request.user?.id,
          id: mealId,
        })
        .del()

      if (!res) {
        return reply.status(404).send({
          error: 'Resource not found',
          message: 'No entity found with the given ID',
        })
      }

      return reply.status(204).send()
    }
  )
}
