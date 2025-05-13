'use client';
import Link from 'next/link';
import { getAllProducts, Product } from '../services/api/CRUD';
import { useQuery } from '@tanstack/react-query';

const fetchAllProducts = async (): Promise<Product[]> => {
    return await getAllProducts();
};

export default function AllTodosPage() {

    const { data, isPending, isError, error } = useQuery<Product[], Error>({
        queryKey: ['product'],
        queryFn: fetchAllProducts,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-10 font-sans">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">All Projects</h2>
                <Link href="/" className="bg-black px-3 py-1 rounded hover:bg-gray-700 text-white">
                    Back
                </Link>
            </div>

            {isPending ? (
                <p className='text-blue-600 text-xl text-center'>Loading projects...</p>
            ) : isError ? (
                <p className='text-red-500 text-center'>Error loading projects: {error.message} </p>
            ) : (
                <div className="min-h-[100px]">
                    {data?.length === 0 ? (
                        <p className="text-gray-500 text-center">No projects available.</p>
                    ) : (
                        <ul className="space-y-2">
                            {data?.map((project: Product) => (
                                <li key={project.id} className="border p-3 rounded shadow-sm text-gray-600">
                                    <p className="font-bold">{project.title}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}