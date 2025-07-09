import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { db } from '../../database/connection.ts'
import { schema } from '../../database/schema/index.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(3, {
            message: 'Question should be at least 3 characters long.',
          }),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
        })
        .returning()

      const createdQuestion = result[0]

      if (!createdQuestion) {
        throw new Error('Failed to create a new question in room')
      }

      return reply.status(201).send({ questionId: createdQuestion.id })
    }
  )
}
