import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    // Cria um ambiente zerado para cada um dos testes
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it.skip('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)
  })

  it.skip('should be able to list all users', async () => {
    // O teste e2e deve funcionar independente dos outros testes
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ])
  })

  it('should be able to login in a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookiesUser1 = createUserResponse.get('Set-Cookie')

    if (!cookiesUser1) {
      throw new Error('Cookie not found')
    }

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe2',
        email: 'johndoe2@example.com',
      })
      .expect(201)

    await request(app.server)
      .patch('/users/login')
      .set('Cookie', cookiesUser1)
      .send({
        name: 'John Doe2',
        email: 'johndoe2@example.com',
      })
      .expect(200)
  })

  // it('should be able to list all transactions', async () => {
  //   // O teste e2e deve funcionar independente dos outros testes
  //   const createTransactionResponse = await request(app.server)
  //     .post('/transactions')
  //     .send({
  //       title: 'New transaction',
  //       amount: 5000,
  //       type: 'credit',
  //     })

  //   const cookies = createTransactionResponse.get('Set-Cookie')

  //   if (!cookies) {
  //     throw new Error('Cookie not found')
  //   }

  //   const listTransactionsResponse = await request(app.server)
  //     .get('/transactions')
  //     .set('Cookie', cookies)
  //     .expect(200)

  //   expect(listTransactionsResponse.body.transactions).toEqual([
  //     expect.objectContaining({
  //       title: 'New transaction',
  //       amount: 5000,
  //     }),
  //   ])
  // })

  // it('should be able to get a specific transaction', async () => {
  //   // O teste e2e deve funcionar independente dos outros testes
  //   const createTransactionResponse = await request(app.server)
  //     .post('/transactions')
  //     .send({
  //       title: 'New transaction',
  //       amount: 5000,
  //       type: 'credit',
  //     })

  //   const cookies = createTransactionResponse.get('Set-Cookie')

  //   if (!cookies) {
  //     throw new Error('Cookie not found')
  //   }

  //   const listTransactionsResponse = await request(app.server)
  //     .get('/transactions')
  //     .set('Cookie', cookies)
  //     .expect(200)

  //   const transactionId = listTransactionsResponse.body.transactions[0].id

  //   const getTransactionsResponse = await request(app.server)
  //     .get(`/transactions/${transactionId}`)
  //     .set('Cookie', cookies)
  //     .expect(200)

  //   expect(getTransactionsResponse.body.transaction).toEqual(
  //     expect.objectContaining({
  //       title: 'New transaction',
  //       amount: 5000,
  //     })
  //   )
  // })

  // it('should be able to get the summary', async () => {
  //   // O teste e2e deve funcionar independente dos outros testes
  //   const createTransactionResponse = await request(app.server)
  //     .post('/transactions')
  //     .send({
  //       title: 'Credit transaction',
  //       amount: 5000,
  //       type: 'credit',
  //     })

  //   const cookies = createTransactionResponse.get('Set-Cookie')

  //   if (!cookies) {
  //     throw new Error('Cookie not found')
  //   }

  //   await request(app.server)
  //     .post('/transactions')
  //     .set('Cookie', cookies)
  //     .send({
  //       title: 'Debit transaction',
  //       amount: 3000,
  //       type: 'debit',
  //     })

  //   const summaryResponse = await request(app.server)
  //     .get('/transactions/summary')
  //     .set('Cookie', cookies)
  //     .expect(200)

  //   expect(summaryResponse.body.summary).toEqual({
  //     amount: 2000,
  //   })
  // })
})
