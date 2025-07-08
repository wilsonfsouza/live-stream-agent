import { defineConfig } from 'drizzle-kit'
import { env } from '@/env/index.ts'

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/database/schema/**.ts',
  out: './src/database/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
