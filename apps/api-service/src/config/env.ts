import { parseEnv, port } from 'znv'
import { z } from 'zod'

const env = parseEnv(process.env, {
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  DB_MIN: z.number().int().positive(),
  DB_MAX: z.number().int().positive(),
  DB_IDLE_TIMEOUT_MILLIS: z.number().int().positive(),
  DB_HOST: z.string(),
  DB_PORT: port(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  SERVER_PORT: port().default(80),
  DAPR_HOST: z.string().default('user-service'),
  DAPR_HTTP_PORT: port().default(3500),
  DAPR_STATESTORE_KEY: z.string().default('lavamedia-statestore'),
  AWS_REGION: z.string(),
})

export { env }
