import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const getRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;

      const [[result], audioChunks] = await Promise.all([
        db
          .select({
            name: schema.rooms.name,
            description: schema.rooms.description,
          })
          .from(schema.rooms)
          .where(eq(schema.rooms.id, roomId))
          .limit(1),
        db
          .select({
            id: schema.audioChunks.id,
          })
          .from(schema.audioChunks)
          .where(eq(schema.audioChunks.roomId, roomId))
          .limit(1),
      ]);

      return {
        name: result.name,
        description: result.description,
        hasAudioRecorded: audioChunks.length > 0,
      };
    }
  );
};
