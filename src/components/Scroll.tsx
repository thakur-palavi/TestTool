'use client'
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios'
import React from 'react'

const fetchFunction = async () => {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return response.data
}
const { data, isFetching, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, error, status } = useInfiniteQuery({
    queryKey: ["Blogs"],
    queryFn: fetchFunction,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage
})

function Scroll() {
    return (
        <div>


        </div>
    )
}

export default Scroll