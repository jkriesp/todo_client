
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTodo from './AddTodo';



describe('AddTodo Component', () => {
    const mockOnTodoAdded = jest.fn();

    beforeEach(() => {
        render(<AddTodo onTodoAdded={mockOnTodoAdded} />);
        mockOnTodoAdded.mockClear();
    });

    test('renders input field and submit button', () => {
        const inputField = screen.getByRole('textbox');
        const submitButton = screen.getByRole('button', { name: /add todo/i });

        expect(inputField).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('allows input to be entered', () => {
        const inputField = screen.getByRole('textbox');
        fireEvent.change(inputField, { target: { value: 'New Todo' } });

        expect(inputField.value).toBe('New Todo');
    });

    test('displays error message when trying to submit empty todo', async () => {
        const submitButton = screen.getByRole('button', { name: /add todo/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.getByText(/title cannot be empty/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

/*     test('submits the todo when a valid input is entered', async () => {
        const inputField = screen.getByRole('textbox');
        const submitButton = screen.getByRole('button', { name: /add todo/i });

        fireEvent.change(inputField, { target: { value: 'New Todo' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          expect(mockOnTodoAdded).toHaveBeenCalledWith({ title: 'New Todo' });
        });
        
    }); */
});
