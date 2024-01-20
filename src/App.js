import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback to localhost if not set


function App() {
    const [todos, setTodos] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);

    // Function to fetch todos from the API
    const fetchTodos = () => {
        fetch('http://127.0.0.1:8080/todos')
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error('Error fetching todos:', error));
    };

    // Fetch todos when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    // Function to handle when a new todo is added
    const handleTodoAdded = (newTodo) => {
        setTodos(prevTodos => {
            const updatedTodos = [...prevTodos, newTodo];
            console.log('Updated Todos:', updatedTodos); // Log the updated todos
            return updatedTodos;
        });
    };

    // Function to handle when a todo is updated
    const handleTodoUpdated = (updatedTodo) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo
            )
        );
        setEditingTodoId(null); // Reset editing state
    };

    // Function to handle when a todo is selected for editing
    const handleEditTodo = (todoId, action) => {
        if (action === 'delete') {
            // Update the todos state to reflect the deletion
            setTodos(todos.filter(todo => todo.id !== todoId));
        } else {
            // Existing logic for setting editingTodoId
            console.log("Editing Todo with ID: ", todoId);
            setEditingTodoId(todoId);
        }
    };

    return (
        <div className='app-wrapper'>
            <div className='header'>
                <h1>My Todo App</h1>
                <AddTodo onTodoAdded={handleTodoAdded} />
            </div>

            <div className='todo-list-container'>
                {editingTodoId ? (
                    <EditTodo
                        todoId={editingTodoId}
                        onTodoUpdated={handleTodoUpdated}
                    />
                ) : (
                    <TodoList
                        todos={todos}
                        onEditTodo={handleEditTodo}
                    />
                )}
            </div>

        </div>
    );
}

export default App;
