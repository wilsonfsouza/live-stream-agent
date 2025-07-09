import { count, desc, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../database/connection.ts'
import { schema } from '../../database/schema/index.ts'

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms',
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          pageSize: z.coerce.number().default(5),
        }),
      },
    },
    async (request) => {
      const { page, pageSize } = request.query

      const [results, [{ totalCount }]] = await Promise.all([
        db
          .select({
            id: schema.rooms.id,
            name: schema.rooms.name,
            createdAt: schema.rooms.createdAt,
            questionsCount: count(schema.questions.id),
          })
          .from(schema.rooms)
          .leftJoin(
            schema.questions,
            eq(schema.questions.roomId, schema.rooms.id)
          )
          .groupBy(schema.rooms.id)
          .orderBy(desc(schema.rooms.createdAt))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ totalCount: count() }).from(schema.rooms),
      ])

      return {
        results,
        meta: {
          resultsCount: results.length,
          totalCount,
        },
      }
    }
  )
}
