'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Post, PostsResponse } from '@/types/commanInterfaces';
import { useState } from 'react';

const API_URL = 'https://dummyjson.com/posts';

const fetchAllPost = async () => {
    const res = await axios.get<PostsResponse>(`${API_URL}`);
    return res.data.posts;
};

const addPostData = async (newPost: { title: string; body: string; userId: number }): Promise<Post> => {
    const response = await axios.post(`${API_URL}/add`, newPost);
    return response.data;
};


const Products = () => {
    const queryClient = useQueryClient();
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');

    const { data, isError, isPending } = useQuery({
        queryKey: ['Posts'],
        queryFn: fetchAllPost,
        staleTime: 6 * 60 * 1000,
    });


    const { mutate, isPending: isAddingPost, isError: isAddPostError, error } = useMutation<Post, Error, { title: string; body: string; userId: number }>({
        mutationFn: addPostData,
        onSuccess: (newPost) => {
            console.log('Post added successfully:', newPost);
            queryClient.setQueryData<Post[]>(['Posts'], (oldData) => {
                return oldData ? [...oldData, newPost] : [newPost];
            });
        },

        onError: (err) => {
            console.error('Mutation failed:', err);
        },
    });

    const handleAddPost = () => {
        if (newPostTitle && newPostBody) {
            mutate({ title: newPostTitle, body: newPostBody, userId: 1 });
            setNewPostTitle('');
            setNewPostBody('');
        } else {
            alert('Please enter both title and body for the new post.');
        }
    };

    if (isAddingPost) return "Adding new post...";
    if (isAddPostError) return `An error occurred while adding a post: ${error?.message}`;

    return (
        <div className="p-6 max-w-full flex justify-items-start items-start mx-auto">
            <div className=" p-4 bg-gray-100 rounded-md shadow-md text-black  items-start">
                <h2 className="text-xl font-semibold mb-2">Add New Post</h2>
                <div className="mb-2">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-1">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-1">Body:</label>
                    <textarea
                        id="body"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newPostBody}
                        onChange={(e) => setNewPostBody(e.target.value)}
                        rows={3}
                    />
                </div>
                <button
                    onClick={handleAddPost}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isAddingPost}
                >
                    {isAddingPost ? 'Adding...' : 'Add Post'}
                </button>
            </div>

            {isPending ? (<p className='text-blue-600 text-lg bg-white p-3 rounded-md'>Loading Posts....</p>) : isError ? (<p className='text-red-500 '>An error occurred while fetching posts: " +</p>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
                {data.map((post: Post) => (
                    <div
                        key={post.id}
                        className="relative bg-white border border-gray-200 rounded-xl shadow-md py-10 px-6 max-w-md transition-transform hover:scale-105 cursor-pointer"
                    >
                        {post.reactions ? (
                            <div className="absolute top-3 right-3 bg-gray-100 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                                👍 {post.reactions?.likes || 0} | 👎 {post.reactions?.dislikes || 0}
                            </div>
                        ) : (
                            <div className="absolute top-3 right-3 bg-gray-100 text-sm font-medium px-3 py-1 rounded-full text-gray-500">
                                No reactions
                            </div>
                        )}
                        <h4 className="text-lg font-semibold mb-2">#{post.id} - {post.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
                    </div>
                ))}
                {data?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">No posts found.</p>
                )}
            </div>)}
        </div>
    );
};

export default Products;