import { z } from 'zod/v4'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  HOST_URL: z.url().startsWith('http'),
  GEMINI_API_KEY: z.string(),
  GEMINI_AUDIO_TRANSCRIPTION_MODEL: z.string(),
  GEMINI_GENERATE_EMBEDDINGS_MODEL: z.string(),
})

export const env = envSchema.parse(process.env)
