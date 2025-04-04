import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', table => {
    table.uuid('id').primary()
    table.uuid('user_id').references('users.id').notNullable()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.boolean('on_diet').notNullable()
    table.date('date').notNullable()
    table.timestamp('consumed_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
