import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback to localhost if not set


function EditTodo({ todoId, onTodoUpdated }) {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (todoId) {
            fetch(`${apiUrl}/todos/${todoId}`)
                .then(response => response.json())
                .then(data => setTitle(data.title));
        }
    }, [todoId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating Todo with ID:', todoId); // Debugging log
        fetch(`${apiUrl}/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: todoId, title })
        })
        .then(response => response.json()) // Get the updated todo
        .then(updatedTodo => {
            onTodoUpdated(updatedTodo); // Pass the updated todo back to App.js
        })
        .catch(error => {
            console.error('Error updating todo:', error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className='input-field'
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button className='button' type="submit">Update Todo</button>
        </form>
    );
}

export default EditTodo;
