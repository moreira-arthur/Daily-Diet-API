import { Knex } from 'knex'

// Declarando as tabelas do knex para deixar o autocomplete mais completo
declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      user_id: string
      title: string
      description: string
      on_diet: boolean
      date: number
      created_at: string
      updated_at: string
    }
    users: {
      id: string
      session_id: string
      name: string
      email: string
      created_at: string
      updated_at: string
    }
  }
}
