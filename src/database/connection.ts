import postgres from 'postgres'
import { env } from '@/env/index.ts'

export const sqlClient = postgres(env.DATABASE_URL)
