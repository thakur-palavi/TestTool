'use client';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { addProduct, deleteProduct, getAllProducts, Product } from '../services/api/CRUD';

const fetchAllProducts = async (): Promise<Product[]> => {
    return await getAllProducts();
};

const addProductData = async (title: string): Promise<Product> => {
    return await addProduct(title);
};

const deleteProductData = async (id: string): Promise<any> => {
    await deleteProduct(id);
};

export default function ItemManger() {
    const [addProjectText, setAddProjectText] = useState<string>('');
    const queryClient = useQueryClient();


    const { data, isPending, isError, error, isFetching, isPlaceholderData } = useQuery<Product[], Error>({
        queryKey: ['product'],
        queryFn: fetchAllProducts,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const addProjectMutation = useMutation<Product, Error, string>({
        mutationFn: addProductData,
        onSuccess: (newProduct) => {
            queryClient.setQueryData<Product[]>(['product'], (prev) => {
                const projects = Array.isArray(prev) ? prev : [];
                return [...projects, newProduct];
            });
            setAddProjectText('');
            console.log("Project added, invalidating projects query.");
        },
        onError: (error) => {
            console.error("Error creating project : ", error);
        }
    });

    const handleProjectAdd = async () => {
        if (addProjectText.trim()) {
            await addProjectMutation.mutateAsync(addProjectText.trim());
        }
    };

    const deleteProjectMutation = useMutation<any, Error, string>({
        mutationFn: deleteProductData,
        onSuccess: (data, deletedId) => {
            queryClient.setQueryData<Product[]>(['productsdf'], (prev) => {
                const products = Array.isArray(prev) ? prev : [];
                return products.filter((ele) => ele?.id !== deletedId);
            });
            console.log(`Project with ID ${deletedId} deleted, invalidating projects query.`);
        },
        onError: (error) => {
            console.error(`Mutation failed for deleting project`, error);
        }
    });

    const handleDelete = (id: string) => {
        deleteProjectMutation.mutate(id);
    };


    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10 font-sans relative">
            <div className='absolute top-0.5 right-1 bg-[#00000080] rounded p-1 text-white'><Link href={"/all-todos"} className="text-white">View all todo</Link>
            </div>
            <h2 className="text-2xl font-semibold my-4 text-center text-gray-700">Simulated Projects CRUD</h2>

            <div className="mb-4 flex flex-col gap-2">
                <input
                    type='text'
                    className='p-2 text-black border-b-black border-2 rounded'
                    value={addProjectText}
                    placeholder="New project name"
                    onChange={(e) => setAddProjectText(e.target.value)}
                    disabled={addProjectMutation.isPending}
                />
                <button
                    onClick={handleProjectAdd}
                    disabled={addProjectMutation.isPending || !addProjectText.trim()}
                    className='bg-green-600 p-2 self-end rounded text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {addProjectMutation.isPending ? "Adding..." : "Create Project"}
                </button>
                {addProjectMutation.isError && <p className='text-red-500 '> Error creating project: {addProjectMutation.error?.message}</p>}
            </div>

            {isPending ? (
                <p className='text-blue-600 text-2xl text-center'>Loading projects...</p>
            ) : isError ? (
                <p className='text-red-500 text-center'>Error: {error.message} </p>
            ) : (
                <div className="min-h-[150px] mb-4">
                    {data?.length === 0 ? (
                        <p className="text-gray-500 text-center">No projects found.</p>
                    ) : (
                        data?.map((project: Product) => (
                            <div key={project.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                <p className="text-gray-800 flex-grow">
                                    {project.id}: {project.title}
                                </p>
                                <button
                                    className='bg-red-500 text-white rounded-md text-sm font-bold p-1 ml-4 disabled:opacity-50 disabled:cursor-not-allowed'
                                    onClick={() => handleDelete(project.id)}
                                    disabled={deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id}
                                >
                                    {deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isPlaceholderData && <p className="text-center text-orange-500 mt-2">Previous data shown</p>}
            {isFetching && !isPlaceholderData && <div className="text-center text-sm text-blue-500 mt-2">Fetching data...</div>}
            {deleteProjectMutation.isError && <p className='text-red-500 mt-2'> Error deleting project: {deleteProjectMutation.error?.message}</p>}
        </div >
    );
}