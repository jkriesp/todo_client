import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function AddTodo({ onTodoAdded }) {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title cannot be empty');
            return;
        }
        setIsSubmitting(true);
        setError(''); // Clear previous error message
        fetch(`${apiUrl}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        .then(response => {
            if (!response.ok) {
                // Read the response as JSON if the response is not ok
                return response.json().then(err => {
                    throw new Error(err.errors.title || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(newTodo => {
            setTitle(''); // Clear the input field
            onTodoAdded(newTodo); // Pass the new todo back to App.js
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            setError(error.message || 'Error adding todo');
        })
        .finally(() => setIsSubmitting(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className='input-field'
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
            />
            <button className='button' id='add-todo-button' type="submit" disabled={isSubmitting}>Add Todo</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default AddTodo;
