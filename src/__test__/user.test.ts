import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../utils/server'
import * as UserService from '../service/user.service'
import * as SessionService from '../service/session.service'
import { createUserSessionHandler } from '../controller/session.controller'

const app = createServer()

const userId = new mongoose.Types.ObjectId().toString()

const userPayload = {
  _id: userId,
  email: 'test1@test.com',
  name: 'test1',
}

const userInput = {
  email: 'test1@test.com',
  name: 'test1',
  password: 'test1password',
  passwordConfirmation: 'test1password',
}

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: 'testAgent',
  createdAt: new Date('2022-05-15T00:00:00.000Z'),
  updatedAt: new Date('2022-05-15T00:00:00.000Z'),
  __v: 0,
}

describe('user', () => {
  describe('user registration', () => {
    describe('given the username and password are valid', () => {
      it('should return the user payload', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload)

        const { statusCode, body } = await supertest(app).post('/api/users').send(userInput)

        expect(statusCode).toBe(200)

        expect(body).toEqual(userPayload)

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput)
      })
    })

    describe('given the passwords do not match', () => {
      it('should return a 400 error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload)

        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send({ ...userInput, passwordConfirmation: 'doesnotmatch' })

        expect(statusCode).toBe(400)

        expect(createUserServiceMock).not.toHaveBeenCalled()
      })
    })

    describe('given the user service thorws', () => {
      it('should return a 409 error', async () => {
        const createUserServiceMock = jest.spyOn(UserService, 'createUser').mockRejectedValueOnce('Oh no!: (')

        const { statusCode } = await supertest(app).post('/api/users').send(userInput)

        expect(statusCode).toBe(409)

        expect(createUserServiceMock).toHaveBeenCalled()
      })
    })
  })

  describe('create user session', () => {
    describe('given the username and password are valid', () => {
      it('should return a signed accessToken & refresh token', async () => {
        jest
          .spyOn(UserService, 'validatePassword')
          // @ts-ignore
          .mockReturnValue(userPayload)

        jest
          .spyOn(SessionService, 'createSession')
          // @ts-ignore
          .mockReturnValue(sessionPayload)

        const req = {
          get: () => {
            return 'a user agent'
          },
          body: {
            email: 'test1@test.com',
            password: 'test1password',
          },
        }

        const send = jest.fn()

        const res = {
          send,
        }

        // @ts-ignore
        await createUserSessionHandler(req, res)

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        })
      })
    })
  })
})
