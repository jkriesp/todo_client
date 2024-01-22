import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function TodoList({ todos, onTodoUpdated, onEditTodo }) {
    const [editingTodo, setEditingTodo] = useState(null); // Updated to handle the entire todo

    const handleEditClick = (todo) => {
        setEditingTodo(todo); // Store the entire todo object for editing
    };

    const handleCancel = () => {
        setEditingTodo(null); // Reset the entire editingTodo state
    };

    const handleDelete = (todoId) => {
        fetch(`${apiUrl}/todos/${todoId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                onEditTodo(todoId, 'delete'); // Notify parent component
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };


    const handleSave = () => {
        fetch(`${apiUrl}/todos/${editingTodo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingTodo) // Send the entire updated todo
        })
        .then(response => response.json())
        .then(updatedTodo => {
            onTodoUpdated(updatedTodo); // Notify parent component
            setEditingTodo(null); // Reset editingTodo state
        })
        .catch(error => console.error('Error updating todo:', error));
    };

    const toggleComplete = (todoId) => {
        const todoToUpdate = todos.find(todo => todo.id === todoId);
        if (!todoToUpdate) {
            console.error('Todo not found');
            return;
        }
    
        const updatedTodo = { ...todoToUpdate, complete: !todoToUpdate.complete };
    
        fetch(`${apiUrl}/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        })
        .then(response => response.json())
        .then(updatedTodo => {
            onEditTodo(updatedTodo, 'update'); // Notify parent component
        })
        .catch(error => console.error('Error updating todo:', error));
    };

    const handleChange = (e) => {
        setEditingTodo({
            ...editingTodo,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            {todos.map(todo => (
                <div className="todo-list-item" key={todo.id}>
                    <input
                        type="checkbox"
                        checked={todo.complete}
                        onChange={() => toggleComplete(todo.id)}
                    />
                    {editingTodo && editingTodo.id === todo.id ? (
                        <input
                            className='input-field'
                            name="title"
                            type="text"
                            value={editingTodo.title}
                            onChange={handleChange}
                        />
                    ) : (
                        <span className={todo.complete ? "todo-title completed" : "todo-title"}>{todo.title}</span>
                    )}
                    <div className="todo-buttons">
                        {editingTodo && editingTodo.id === todo.id ? (
                            <>
                                <button className="button save-button" onClick={handleSave}>Save</button>
                                <button className="button cancel-button" onClick={handleCancel}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="button delete-button" onClick={() => handleDelete(todo.id)}>Delete</button>
                                <button className="button edit-button" onClick={() => handleEditClick(todo)}>Edit</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TodoList;