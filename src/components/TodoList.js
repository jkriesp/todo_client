import React from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback to localhost if not set


function TodoList({ todos, onEditTodo }) {
    const handleDelete = (todoId) => {
        fetch(`http://127.0.0.1:8080/todos/${todoId}`, { method: 'DELETE' })
            .then(() => {
                // Notify parent component to update the todos list
                onEditTodo(todoId, 'delete');
            }).catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

    return (
        <div>
            {todos.map(todo => (
                <div className="todo-list-item" key={todo.id}>
                    <span className="todo-title">{todo.title}</span>
                    <div className="todo-buttons">
                        <button className="button delete-button" onClick={() => handleDelete(todo.id)}>Delete</button>
                        <button className="button edit-button" onClick={() => onEditTodo(todo.id)}>Edit</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
