import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, sqlClient } from './connection.ts'

async function runMigration() {
	console.log('Migration started')

	try {
		await migrate(db, { migrationsFolder: './migrations' })
		console.log('Migration completed')
	} catch (error) {
		console.error('Migration failed:', error)
	} finally {
		await sqlClient.end()
	}
}

runMigration().catch((error) => console.error('Error in migration process:', error))