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
    }
    users: {
      id: string
      session_id: string
      name: string
      email: string
    }
  }
}
