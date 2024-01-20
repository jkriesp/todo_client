import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Fallback to localhost if not set


function AddTodo({ onTodoAdded }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:8080/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        .then(response => response.json())
        .then(newTodo => {
            if (newTodo) {
                console.log("New Todo:", newTodo)
                setTitle(''); // Clear the input field
                onTodoAdded(newTodo); // Pass the new todo back to App.js
            }
        })
        .catch(error => {
            console.error('Error adding todo:', error);
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
            <button className='button' type="submit">Add Todo</button>
        </form>
    );
}

export default AddTodo;
