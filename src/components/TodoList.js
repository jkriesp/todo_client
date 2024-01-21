import React, { useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function TodoList({ todos, onTodoUpdated, onEditTodo }) {
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');

    const handleEditClick = (todo) => {
        setEditingTodoId(todo.id);
        setEditedTitle(todo.title || '');
    };

    const handleCancel = () => {
        setEditingTodoId(null);
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

    const handleSave = (todoId) => {
        fetch(`${apiUrl}/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: todoId, title: editedTitle })
        })
            .then(response => response.json())
            .then(updatedTodo => {
                onTodoUpdated(updatedTodo);
                setEditingTodoId(null);
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

    return (
        <div>
            {todos.map(todo => (
                <div className="todo-list-item" key={todo.id}>
                    <input
                        type="checkbox"
                        checked={todo.complete}
                        onChange={() => toggleComplete(todo.id, todo.complete)}
                    />
                    {editingTodoId === todo.id ? (
                        <input
                            className='input-field'
                            type="text"
                            value={editingTodoId === todo.id ? editedTitle : ''}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            disabled={editingTodoId !== todo.id}
                        />
                    ) : (
                        <span className={todo.complete ? "todo-title completed" : "todo-title"}>{todo.title}</span>
                    )}
                    <div className="todo-buttons">
                        {editingTodoId === todo.id ? (
                            <>
                                <button className="button save-button" onClick={() => handleSave(todo.id)}>Save</button>
                                <button className="button cancel-button" onClick={handleCancel}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button className="button delete-button" onClick={() => handleDelete(todo.id, 'delete')}>Delete</button>
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