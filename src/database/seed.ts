import { reset, seed } from 'drizzle-seed'
import { db, sqlClient } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.date({ minDate: '2025-7-1', maxDate: '2025-7-9' }),
      },
      with: {
        questions: 5,
      },
    },
  }
})

await sqlClient.end()

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log('Database seeded')
