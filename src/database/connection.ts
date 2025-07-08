import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env/index.ts'
import { schema } from './schema/index.ts'

export const sqlClient = postgres(env.DATABASE_URL)
export const db = drizzle(sqlClient, {
  schema,
  casing: 'snake_case',
})
