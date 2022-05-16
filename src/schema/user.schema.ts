import { object, string, TypeOf } from 'zod'

export const userSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - It should be 6 chars minimum'),
    passwordConfirmation: string({
      required_error: 'Password Confirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }).refine((data: any) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
})

export type userInput = Omit<TypeOf<typeof userSchema>, 'body.passwordConfirmation'>
