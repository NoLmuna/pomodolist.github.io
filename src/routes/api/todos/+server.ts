import { db } from '$lib/server/db';
import { todoTable } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

/**
 * Fetch all tasks.
 */
export async function GET() {
    const todos = db.select().from(todoTable).all();
    return json(todos);
}

/**
 * Add a new task.
 */
export async function POST({ request }) {
    const { task } = await request.json();
    if (!task) {
        return json({ error: 'Task cannot be empty' }, { status: 400 });
    }

    db.insert(todoTable).values({ task, isDone: 0 }).run();
    return json({ success: true });
}

/**
 * Delete a task by ID.
 */
export async function DELETE({ request }) {
    const { id } = await request.json();
    if (!id) {
        return json({ error: 'Task ID is required' }, { status: 400 });
    }

    const result = db.delete(todoTable).where(eq(todoTable.id, id)).run();
    if (result.changes === 0) {
        return json({ error: 'Task not found' }, { status: 404 });
    }

    return json({ success: true });
}

/**
 * Update the "is_done" status of a task.
 */
export async function PATCH({ request }) {
    const { id, is_done } = await request.json();
    if (typeof id === 'undefined' || typeof is_done === 'undefined') {
        return json({ error: 'Task ID and is_done status are required' }, { status: 400 });
    }

    const result = db.update(todoTable)
        .set({ isDone: is_done })
        .where(eq(todoTable.id, id))
        .run();

    if (result.changes === 0) {
        return json({ error: 'Task not found' }, { status: 404 });
    }

    return json({ success: true });
}