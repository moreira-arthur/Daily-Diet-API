import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.boolean('on_diet').after('consumed_at').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.dropColumn('on_diet')
  })
}
