'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Need useQueryClient too!
import { useState } from 'react';

const createTodo = async (newTodoData: any) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTodoData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to create todo');
    }
    return response.json();
};

export default function Simple() {
    const [newPostTitle, setNewPostTitle] = useState('');
    const queryClient = useQueryClient();
    const {
        mutate, isError, isSuccess, isPending } = useMutation({
            mutationFn: createTodo,
            onSuccess: (data) => {
                console.log("Todo created successfully:", data);
                queryClient.invalidateQueries({ queryKey: ['todos'] });
            },
            onError: (error, variables, context) => {
                console.error("Error creating todo:", error);
                alert(`Failed to create todo: ${error.message}`);
            },
        });

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const newTodo = {
            title: newPostTitle,
            completed: false,
            userId: 1
        };
        mutate(newTodo);
        setNewPostTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New Todo</h3>
            <input type="text" name="title" required placeholder="Todo title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Todo'}
            </button>
            {isSuccess && <p>Todo added!</p>}
            {isError && <p>Error adding todo.</p>}
        </form>
    );
}
