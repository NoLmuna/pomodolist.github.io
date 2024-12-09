<script>
    import { onMount } from 'svelte';

    let timer = 25 * 60;
    let isRunning = false;

    let currentMode = 'pomodoro';

    const toggleTimer = () => {
        isRunning = !isRunning;
    };

    const resetTimer = () => {
        isRunning = false;
        if (currentMode === 'pomodoro') {
            timer = 25 * 60;
        } else if (currentMode === 'shortBreak') {
            timer = 5 * 60;
        } else if (currentMode === 'longBreak') {
            timer = 10 * 60;
        }
    };

    const setPomodoro = () => {
        currentMode = 'pomodoro';
        resetTimer();
    };

    const setShortBreak = () => {
        currentMode = 'shortBreak';
        resetTimer();
    };

    const setLongBreak = () => {
        currentMode = 'longBreak';
        resetTimer();
    };

    const formatTime = (/** @type {number} */ seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    onMount(() => {
        const interval = setInterval(() => {
            if (isRunning) {
                if (timer > 0) {
                    timer -= 1;
                } else {
                    isRunning = false;
                    alert(`${currentMode === 'pomodoro' ? 'Pomodoro' : currentMode === 'shortBreak' ? 'Short Break' : 'Long Break'} time is up!`);
                    resetTimer();
                }
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

<style>
    .body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Arial', sans-serif;
        background-color: #2c3e50;
        color: #ecf0f1;
        box-sizing: border-box;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 600px;
        padding: 2rem;
        background-color: #34495e;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 2rem;
        color: #f39c12;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .date-display {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: #bdc3c7;
    }

    .timer-display {
        font-size: 6rem;
        font-weight: bold;
        margin-bottom: 2rem;
        color: white;
    }

    .transparent-buttons button {
        background-color: rgba(52, 152, 219, 0.5); 
        border: none;
        padding: 0.5rem 1rem;
        margin: 0.5rem;
        color: white;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .transparent-buttons button:hover {
        background-color: rgba(41, 128, 185, 0.7);
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .button-group button {
        background-color: #3498db;
        color: #fff;
        border: none;
        padding: 0.8rem 1.2rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.2rem;
    }

    .button-group button:hover {
        background-color: #2980b9;
    }

    .todo-container {
        display: flex;
        flex-direction: column;
        margin-top: 2rem;
        width: 100%;
        gap: 0.5rem;
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
        flex-direction: row;
        align-items: center;
        background-color: #2c3e50;
        padding: 0.5rem;
        border-radius: 4px;
        color: #ecf0f1;
        flex-wrap: wrap;
        word-break: break-word;
    }

    li span {
        flex: 1;
        margin-left: 1rem;
        word-wrap: break-word;
    }

    li button {
        background-color: #e74c3c;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        margin-left: 1rem;
        flex-shrink: 0;
    }

    .completed {
        text-decoration: line-through;
        color: #95a5a6;
    }
    @media (max-width: 768px) {
    .container {
        padding: 1rem;
        max-width: 100%;
    }

    .title {
        font-size: 2rem;
    }

    .timer-display {
        font-size: 4rem;
    }

    .transparent-buttons button,
    .button-group button,
    li button {
        font-size: 0.8rem;
        padding: 0.5rem;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 1.5rem;
    }

    .timer-display {
        font-size: 3rem;
    }

    .transparent-buttons button,
    .button-group button,
    li button {
        font-size: 0.7rem;
        padding: 0.3rem;
    }

    input[type='text'] {
        font-size: 0.9rem;
        padding: 0.6rem;
    }

    li span {
        margin-left: 0.5rem;
    }
}
</style>

<div class="body">
    <div class="container">
        <div class="title">POMO-DOLIST</div>
    
        <div class="date-display">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        <!-- Transparent Buttons -->
        <div class="transparent-buttons">
            <button on:click={setPomodoro}>Pomodoro</button>
            <button on:click={setShortBreak}>Short Break</button>
            <button on:click={setLongBreak}>Long Break</button>
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
</div>