import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the To-Do table
export const todoTable = sqliteTable('todos', {
    id: integer('id').primaryKey(),
    task: text('task').notNull(),
    isDone: integer('is_done').default(0), // 0: false, 1: true
});
