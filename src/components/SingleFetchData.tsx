'use client'
import { getSinglePost } from '@/app/first/[id]/page';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react'
interface PostType {
    id: number;
    body: string;
    title: string;
}

function SingleFetchData({ title, body, id }: PostType) {
    const { isLoading, isError, error } = useQuery({
        queryKey: ['posts', id],
        queryFn: () => getSinglePost(id),
    })
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error fetching data : {error.message}</div>
    return (
        <div className='border-l-2 border-amber-400 rounded-sm bg-[#ffffff30] mb-1.5 cursor-pointer p-6 max-w-2xl m-auto'>
            < h1 className='text-center' > Post Id Number: {id} </h1>
            <p className='font-bold text-amber-400'>{id}</p>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-4">{body}</p>
            <Link href="/" className="bg-black px-3 py-1 rounded hover:bg-gray-700 text-white mr-auto">
                Back
            </Link>
        </div>
    )
}

export default SingleFetchData