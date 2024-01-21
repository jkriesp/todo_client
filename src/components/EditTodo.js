import React, { useState, useEffect } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function EditTodo({ todoId, onTodoUpdated }) {
    const [todo, setTodo] = useState({ id: null, title: '', description: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (todoId) {
            fetch(`${apiUrl}/todos/${todoId}`)
                .then(response => response.json())
                .then(data => setTodo({
                    id: data.id,
                    title: data.title,
                    description: data.description // Assuming description is part of your model
                }))
                .catch(error => {
                    console.error('Error fetching todo:', error);
                    setError('Failed to fetch todo');
                });
        }
    }, [todoId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!todo.title.trim()) {
            setError('Title cannot be empty');
            return;
        }
        setIsSubmitting(true);
        setError(''); // Clear previous error message
        fetch(`${apiUrl}/todos/${todo.id}`, { // Using todo.id from state
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(updatedTodo => {
            onTodoUpdated(updatedTodo); // Pass the updated todo back to App.js
        })
        .catch(error => {
            console.error('Error updating todo:', error);
            setError('Failed to update todo');
        })
        .finally(() => setIsSubmitting(false));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodo(prevTodo => ({
            ...prevTodo,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                className='input-field'
                name="title"
                type="text"
                value={todo.title}
                onChange={handleInputChange}
                disabled={isSubmitting}
            />
            {/* Include other fields as needed, for example, description */}
            <button className='button' type="submit" disabled={isSubmitting}>Update Todo</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default EditTodo;
