'use client';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Project {
    title: string;
    body: string;
    userId: number;
    id: number
}
interface CreateProjectType {
    title: string;
    body: string;
    userId: number;
}
interface ApiResponse {
    projects: Project[];
    totalCount: number;
}

const PAGE_SIZE = 10;

export default function Todos() {
    const queryClient = useQueryClient()
    const [page, setPage] = useState<number>(1);
    const [addProject, setAddProject] = useState<string>('')

    const fetchProjects = async (pageIndex: number): Promise<ApiResponse> => {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${pageIndex}&_limit=${PAGE_SIZE}`);
        const totalCount = parseInt(response.headers['x-total-count'], 10);
        const projects = response.data
        return { projects, totalCount };
    };


    const addProjects = async (newProject: CreateProjectType) => {
        const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, newProject);
        return response.data
    }

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
    const { data, isPending, isError, error, isFetching, isPlaceholderData } = useQuery<ApiResponse, Error>({
        queryKey: ['projects', page],
        queryFn: () => fetchProjects(page),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

    const ProjectMutation = useMutation<any, Error, CreateProjectType>({
        mutationFn: addProjects,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', page] });
            setAddProject('')
        },
        onError: (error) => {
            console.log("Error creating project : ", error)
        }
    })

    const handleProjectAdd = async () => {
        if (addProject.trim()) {
            const values: CreateProjectType = {
                title: addProject,
                body: "hello discription",
                userId: 1,
            }
            await ProjectMutation.mutateAsync(values);
        }
    }
    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', page] });
            console.log(`Mutation successful for deleting todo`);
        },
        onError: (error, variables) => {
            console.error(`Mutation failed for deleting todo ${variables}:`, error);
        }
    });
    const handleDelete = (userId: any) => {
        deleteTodoMutation.mutate(userId);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10 font-sans">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Paginated Projects</h2>

            <div className="mb-4 flex flex-col gap-2">
                <input type='text' className='p-2 text-black border-b-black  border-2 rounded' value={addProject} placeholder="New project name" onChange={(e) => setAddProject(e.target.value)} />
                <button onClick={handleProjectAdd} disabled={ProjectMutation.isPending} className='bg-green-600 p-2 self-end rounded '>
                    {ProjectMutation.isPending ? "Loading" : "Create Project"}
                </button>
                {ProjectMutation.isError && <p className='text-red-500 '> Error creating project: {ProjectMutation.error?.message}</p>}
            </div>
            {isPending ? (
                <p className='text-blue-600 text-2xl'>Loading First Data </p>) : isError ? (<p className='text-red-500 '>Error: {error.message} </p>) :
                (<div className="min-h-[150px] mb-4">
                    {data?.projects.map((project) => (
                        <div key={project.id} className=' flex items-start justify-between border-b border-gray-200 last:border-b-0 mb-1.5'> <p className="text-gray-800 py-1 ">
                            {project.id}: {project.title}
                        </p>
                            <button
                                className='bg-red-500 rounded-md text-sm font-bold p-1'
                                onClick={() => handleDelete(project.id)}
                                disabled={deleteTodoMutation.isPending}
                            >
                                {deleteTodoMutation.isPending && deleteTodoMutation.variables === project.id ? 'Deleting...' : 'Delete'}
                            </button></div>
                    ))}
                </div>
                )}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || isFetching}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}

                </span>
                <button
                    onClick={() => {
                        if (!isPlaceholderData && page < totalPages) {
                            setPage((prev) => prev + 1);
                        }
                    }}
                    disabled={page >= totalPages || isFetching}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            {isPlaceholderData && <p className="text-center text-orange-500">Previous data shown</p>}
            {isFetching && <div className="text-center text-sm text-blue-500 mt-2">Fetching data...</div>}
        </div >)
}
