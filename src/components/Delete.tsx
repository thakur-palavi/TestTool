'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchTodos = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};

const deleteTodo = async (userId: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete todo ${userId}`);
    }
    console.log(`Todo with ID: ${userId} successfully deleted (simulated).`);
    return { id: userId };
};


export default function Delete() {
    const queryClient = useQueryClient();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchTodos,
    });

    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: (variables) => {
            console.log(`Mutation successful for deleting todo`);
            queryClient.setQueryData(['posts'], (oldData: any) => {
                return oldData.filter((post: any) => post.id !== variables)
            })
        },
        onError: (error, variables) => {
            console.error(`Mutation failed for deleting todo ${variables}:`, error);
        }
    });

    if (isLoading) return <div>Loading todos...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    const handleDelete = (userId: any) => {
        deleteTodoMutation.mutate(userId);
    };

    return (
        <div>
            <h1>Todo List</h1>
            <ul>
                {posts.map((todo: any) => (
                    <li key={todo.id} className=' bg-[#ffffff29] p-3 rounded mb-3'>
                        {todo.title}
                        {' '}<br />
                        <button
                            className='bg-red-500 rounded-md text-sm font-bold p-1'
                            onClick={() => handleDelete(todo.id)}
                            disabled={deleteTodoMutation.isPending}
                        >
                            {deleteTodoMutation.isPending && deleteTodoMutation.variables === todo.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </li>
                ))}
            </ul>
            {deleteTodoMutation.isError && <p style={{ color: 'red' }}>Error deleting todo.</p>}
        </div>
    );
}

