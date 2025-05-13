"use client";
import React, { useEffect, useState } from 'react';

interface TodoType {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const fetchData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const fetchUpdate = async (updateTitle: string, id: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: updateTitle }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
    const data = await response.json();
    return data;
};

const deleteFetch = async (id: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE"
    });
};

function ToDoList() {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<null | string>(null);
    const [editTitles, setEditTitles] = useState<Record<number, string>>({});

    useEffect(() => {
        const getTodos = async () => {
            try {
                const data = await fetchData();
                setTodos(data.slice(0, 5));
            } catch (err: any) {
                setErr(err.message);
            } finally {
                setLoading(false);
            }
        };
        getTodos();
    }, []);

    const handleUpdate = async (id: number) => {
        const newTitle = editTitles[id];
        if (!newTitle) return;

        const updated = await fetchUpdate(newTitle, id);

        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, title: updated.title } : todo
            )
        );

        setEditTitles((prev) => {
            const updatedTitles = { ...prev };
            delete updatedTitles[id];
            return updatedTitles;
        });
    };

    const handleDelete = async (id: number) => {
        await deleteFetch(id);
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    if (loading) return <div>Loading...</div>;
    if (err) return <div>Error fetching todos: {err}</div>;

    return (
        <div>
            <h1>ToDoList</h1>
            <div className='flex flex-wrap gap-3'>
                {todos.map((todo) => (
                    <div key={todo.id} className='bg-[#ffffff30] p-3 rounded w-fit flex-1 min-w-48 max-w-48'>
                        <h2 className='font-bold truncate '>{todo.title.toLocaleUpperCase()}</h2>
                        <p >
                            Completed:<span className={todo.completed ? "text-green-600" : "text-red-600"}>{todo.completed ? 'Yes' : 'No'}</span>
                        </p>
                        <input
                            type='text'
                            value={editTitles[todo.id] || ''}
                            onChange={(e) =>
                                setEditTitles((prev) => ({ ...prev, [todo.id]: e.target.value }))
                            }
                            className='w-full border-[#ffffff60] border-2 rounded'
                            placeholder='New title'
                        />
                        <div className=' flex justify-between'>  <button onClick={() => handleUpdate(todo.id)} className='text-green-500'>Update</button>
                            <button onClick={() => handleDelete(todo.id)} className='text-red-600'>Delete</button></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ToDoList;
