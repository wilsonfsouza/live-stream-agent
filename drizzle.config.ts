import { defineConfig } from 'drizzle-kit'
import { env } from './src/env/index.ts'

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/database/schema/**.ts',
  out: './.drizzle/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? 'require' : undefined
  },
})
