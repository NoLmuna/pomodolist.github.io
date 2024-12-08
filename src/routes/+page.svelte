<script>
    import { onMount } from 'svelte';

    // Pomodoro Timer State
    let timer = 25 * 60; // 25 minutes
    let isRunning = false;

    const toggleTimer = () => {
        isRunning = !isRunning;
    };

    const resetTimer = () => {
        isRunning = false;
        timer = 25 * 60;
    };

    const formatTime = (/** @type {number} */ seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Timer countdown
    onMount(() => {
        const interval = setInterval(() => {
            if (isRunning && timer > 0) {
                timer -= 1;
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    // To-Do List State
    /**
	 * @type {any[]}
	 */
    let todos = [];
    let newTask = '';

    const fetchTodos = async () => {
        const response = await fetch('/api/todos');
        todos = await response.json();
    };

    const addTodo = async () => {
        if (!newTask.trim()) return;
        await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: newTask }),
        });
        newTask = '';
        fetchTodos();
    };

    const deleteTodo = async (/** @type {any} */ id) => {
        await fetch('/api/todos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchTodos();
    };

    const toggleDone = async (/** @type {any} */ id, /** @type {number} */ isDone) => {
        await fetch('/api/todos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_done: isDone === 1 ? 0 : 1 }),
        });
        fetchTodos();
    };

    // Fetch existing tasks on page load
    onMount(fetchTodos);

    // Handle Enter key press
    const handleKeyDown = (/** @type {{ key: string; }} */ event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    };
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
    /* Reset styles */
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #34495e; /* Match container background */
        font-family: 'Arial', sans-serif;
        color: #ecf0f1; /* Light text */
        box-sizing: border-box;
    }

    /* Center container */
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 600px;
        padding: 2rem;
        background-color: #34495e; /* Matches body background */
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    /* Title styling */
    .title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 2rem;
        color: #f39c12; /* Gold color for title */
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    /* Date display */
    .date-display {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: #bdc3c7; /* Subtle grey for date */
    }

    /* Timer display */
    .timer-display {
        font-size: 6rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }

    /* Button group */
    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    button {
        padding: 0.8rem 1.2rem;
        border: none;
        border-radius: 4px;
        background-color: #3498db;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #2980b9;
    }

    /* To-do list styling */
    .todo-container {
        margin-top: 2rem;
        width: 100%;
    }

    input[type='text'] {
        width: 100%;
        padding: 0.8rem;
        border: none;
        border-radius: 4px;
        margin-bottom: 1rem;
        background-color: #2c3e50;
        color: #ecf0f1;
        font-size: 1rem;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        display: flex;
        align-items: center;
        background-color: #2c3e50;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border-radius: 4px;
        color: #ecf0f1;
    }

    li span {
        flex-grow: 1;
        margin-left: 1rem;
    }

    li button {
        background-color: #e74c3c;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
    }

    .completed {
        text-decoration: line-through;
        color: #95a5a6; /* Grey color for completed tasks */
    }
</style>

<div class="container">
    <div class="title">POMO-DOLIST</div>

    <div class="date-display">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    </div>

    <div class="timer-display">{formatTime(timer)}</div>
    <div class="button-group">
        <button on:click={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
        <button on:click={resetTimer}>Reset</button>
    </div>

    <div class="todo-container">
        <input
            type="text"
            bind:value={newTask}
            placeholder="Add new task"
            on:keydown={handleKeyDown}
        />
        <ul>
            {#each todos as todo}
                <li>
                    <input
                        type="checkbox"
                        checked={todo.isDone === 1}
                        on:change={() => toggleDone(todo.id, todo.isDone)}
                    />
                    <span class:completed={todo.isDone === 1}>{todo.task}</span>
                    <button on:click={() => deleteTodo(todo.id)}>Delete</button>
                </li>
            {/each}
        </ul>
    </div>
</div>