import config from 'config'
import logger from './utils/logger'
import connect from './utils/connect'
import createServer from './utils/server'

const port = config.get<number>('port')

const app = createServer()

app.listen(8000, async () => {
  logger.info(`App is running at http://localhost:${port}`)

  await connect()
})
