import { omit } from 'lodash'
import { FilterQuery } from 'mongoose'
import UserModel, { UserDocument, UserInput } from '../models/user.model'

export async function createUser(newUser: UserInput) {
  try {
    const user = await UserModel.create(newUser)

    return omit(user.toJSON(), 'password')
  } catch (err: any) {
    throw new Error(err)
  }
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
  const user = await UserModel.findOne({ email })

  if (!user) {
    return false
  }

  const isValid = await user.comparePassword(password)

  if (!isValid) return false

  return omit(user.toJSON(), 'password')
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean()
}
