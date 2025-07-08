import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from '@/database/schema/index.ts'
import { env } from '@/env/index.ts'

export const sqlClient = postgres(env.DATABASE_URL)
export const db = drizzle(sqlClient, {
  schema,
  casing: 'snake_case',
})
