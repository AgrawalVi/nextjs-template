import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { usersTable } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), age: z.number().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(usersTable).values({
        name: input.name,
        age: input.age,
        email: input.email,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.select().from(usersTable).orderBy(desc(usersTable.id)).limit(1);

    return user ?? null;
  }),
});
