import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function metricsRoute(app: FastifyInstance) {
  app.get(
    '/all',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const mealCountBodySchema = z.object({
        count: z.number(),
      })

      const totalMeals = mealCountBodySchema.parse(
        await knex('meals')
          .where('user_id', request.user?.id)
          .count({ count: '*' })
          .first()
      )

      const onDietMeals = mealCountBodySchema.parse(
        await knex('meals')
          .where({ user_id: request.user?.id, on_diet: true })
          .count({ count: '*' })
          .first()
      )

      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .select('id', 'on_diet', 'date')
        .orderBy('date', 'desc')

      const { bestDietStreak } = meals.reduce(
        (acc, meal) => {
          if (meal.on_diet) {
            acc.currStreak += 1
          } else {
            acc.currStreak = 0
          }

          if (acc.currStreak > acc.bestDietStreak) {
            acc.bestDietStreak = acc.currStreak
          }

          return acc
        },
        { bestDietStreak: 0, currStreak: 0 }
      )

      return reply.status(200).send({
        'Total of meals': totalMeals.count,
        'Total meals in the diet': onDietMeals.count,
        'Total number of meals outside the diet.':
          totalMeals.count - onDietMeals.count,
        'Best streak of diet': bestDietStreak,
      })
    }
  )

  app.get(
    '/total',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const mealCountBodySchema = z.object({
        count: z.number(),
      })

      const mealsCount = await knex('meals')
        .where('user_id', request.user?.id)
        .count({ count: '*' })
        .first()

      const totalOfMeals = mealCountBodySchema.parse(mealsCount)
      if (mealsCount) {
        return reply.status(200).send({
          'Total of meals': totalOfMeals.count,
        })
      }
      return reply.status(404).send()
    }
  )

  app.get(
    '/total/on',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const mealCountBodySchema = z.object({
        count: z.number(),
      })

      const mealsCount = await knex('meals')
        .where({ user_id: request.user?.id, on_diet: true })
        .count({ count: '*' })
        .first()

      const totalOfMeals = mealCountBodySchema.parse(mealsCount)
      if (mealsCount) {
        return reply.status(200).send({
          'Total meals in the diet': totalOfMeals.count,
        })
      }
      return reply.status(404).send()
    }
  )

  app.get(
    '/total/out',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const mealCountBodySchema = z.object({
        count: z.number(),
      })

      const mealsCount = await knex('meals')
        .where({ user_id: request.user?.id, on_diet: false })
        .count({ count: '*' })
        .first()

      const totalOfMeals = mealCountBodySchema.parse(mealsCount)
      if (mealsCount) {
        return reply.status(200).send({
          'Total number of meals outside the diet.': totalOfMeals.count,
        })
      }
      return reply.status(404).send()
    }
  )

  app.get(
    '/streak',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      //   const mealSchema = z.array(
      //     z.object({
      //       id: z.string(),
      //       on_diet: z.boolean(),
      //       date: z.number(),
      //     })
      //   )
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .select('id', 'on_diet', 'date')
        .orderBy('date', 'desc')

      let maxStreak = 0
      let currStreak = 0
      for (const meal of meals) {
        if (meal.on_diet) {
          currStreak++
          if (currStreak > maxStreak) {
            maxStreak = currStreak
          }
        } else {
          currStreak = 0
        }
      }
      return reply.status(200).send({ 'Maximum streak:': maxStreak })
    }
  )
}
