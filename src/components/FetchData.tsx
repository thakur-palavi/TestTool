'use client'
import { deletePost, fetchPosts, patchPost } from '@/api/route';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react';


function FetchData() {
    const [pageNumber, setPageNumber] = useState(0);

    const queryClient = useQueryClient()

    const getPostData = async (pageNumber: number) => {
        try {
            const res = await fetchPosts(pageNumber);
            return res.status === 200 ? res.data : []
        } catch (error) {
            console.log(error);
            return []
        }
    }
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', pageNumber],
        queryFn: () => getPostData(pageNumber),
        placeholderData: keepPreviousData,
        gcTime: 1000,  //garbage collection time 
        // staleTime: 10000, //0 h rkhoo agar hr sec pr fresh dat stale ho rha hai
        // refetchInterval: 1000, hr second me load kr rha hai 
        // refetchIntervalInBackground: true,    // cahte ho ki agr kahi bhe swift kr lun tabhi bhe fetch krte rhe                                                        
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => deletePost(id),
        onSuccess: (data, id) => {
            queryClient.setQueryData(['posts', pageNumber], (data: any) => {
                return data.filter((post: any) => post.id !== id)
            })
        }
    })

    const patchMutation = useMutation({
        mutationFn: (id) => patchPost(id),
        onSuccess: (apidata, postId) => (
            queryClient.setQueryData(['posts', pageNumber], (data: any) => {
                return data.map((postitem: any) => postitem.id == postId ?
                    { ...postitem, title: apidata.data.title } : postitem)
            })
        )
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error fetching data : {error.message}</div>

    return (
        <div className=' mt-8 flex flex-col '>
            <ul className=' max-w-4xl gap-2.5 m-auto'>
                {data.map((todo: any) => {
                    const { id, title, body } = todo
                    return (
                        <li key={id} className='border-l-2 border-amber-400 rounded-sm bg-[#ffffff30] h-full w-full mb-1.5 p-3 cursor-pointer  m-auto'>
                            <Link href={`/first/${id}`} className=''>
                                <strong>  {id}. </strong> <strong>  {title} </strong>
                                <br />
                                {body}
                            </Link>
                            <button className="text-amber-400 text-sm p-1 rounded bg-[#f5f5f540] ml-1"
                                onClick={() => patchMutation.mutate(id)}> Update</button>
                            <button className="text-red-600 text-sm p-1 rounded bg-[#f5f5f540] ml-1"
                                onClick={() => deleteMutation.mutate(id)}> Delete</button>
                        </li>
                    )
                })}
            </ul>
            <div className='flex items-center justify-center gap-1'>
                <button onClick={() => setPageNumber((prev) => prev - 3)} className='bg-amber-600 p-2 rounded cursor-pointer'
                    disabled={pageNumber === 0}> prev</button>
                <p> {pageNumber / 3 + 1}</p>
                <button onClick={() => setPageNumber((prev) => prev + 3)} className='bg-amber-600 p-2 rounded'>
                    next</button>
            </div>
        </div>
    )
}

export default FetchData;