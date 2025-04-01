import { Knex } from 'knex'

// Declarando as tabelas do knex para deixar o autocomplete mais completo
declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      title: string
      description: string
      consumed_at: string
      on_diet: boolean
      session_id?: string
    }
  }
}
