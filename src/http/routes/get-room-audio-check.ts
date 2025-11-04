import { eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const getRoomAudioCheckRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;

      const audioChunks = await db
        .select({
          id: schema.audioChunks.id,
        })
        .from(schema.audioChunks)
        .where(eq(schema.audioChunks.roomId, roomId))
        .limit(1);

      return {
        hasAudioRecorded: audioChunks.length > 0,
      };
    }
  );
};
