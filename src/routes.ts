import { Express, Request, Response } from 'express'
import {
  createProductHandler,
  deleteProductHandler,
  getProductHanlder,
  updateProductHandler,
} from './controller/product.controller'
import { deleteSessionsHandler, getUserSessionsHandler } from './controller/session.controller'
import { createUserHandler } from './controller/user.controller'
import requireUser from './middleware/requireUser'
import validateResource from './middleware/validateResource'
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema'
import { createSessionSchema } from './schema/session.schema'
import { userSchema } from './schema/user.schema'

export default function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

  app.post('/api/users', validateResource(userSchema), createUserHandler)

  app.post('/api/sessions', validateResource(createSessionSchema), createUserHandler)
  app.get('/api/sessions', requireUser, getUserSessionsHandler)
  app.delete('/api/sessions', requireUser, deleteSessionsHandler)

  app.post('/api/products', [requireUser, validateResource(createProductSchema)], createProductHandler)

  app.put('/api/products/:productId', [requireUser, validateResource(updateProductSchema)], updateProductHandler)
  app.get('/api/products/:productId', validateResource(getProductSchema), getProductHanlder)
  app.delete('/api/products/:productId', [requireUser, validateResource(deleteProductSchema)], deleteProductHandler)
}
