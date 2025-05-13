'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Post, PostsResponse } from '@/types/commanInterfaces';
import { useState, useMemo } from 'react'; // Import useMemo

const API_URL = 'https://dummyjson.com/posts';

const fetchAllPost = async () => {
    const res = await axios.get<PostsResponse>(`${API_URL}`);
    return res.data.posts;
};

const addPostData = async (newPost: { title: string; body: string; userId: number }): Promise<Post> => {
    const response = await axios.post(`${API_URL}/add`, newPost);
    return response.data;
};


const Product = () => {
    const queryClient = useQueryClient();
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');

    const [sortBy, setSortBy] = useState<'id' | 'title' | 'body' | 'likes' | 'dislikes'>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { data: posts, isError, isPending } = useQuery<Post[], Error>({
        queryKey: ['Posts'],
        queryFn: fetchAllPost,
        staleTime: 6 * 60 * 1000,
    });

    const { mutate, isPending: isAddingPost, isError: isAddPostError, error } = useMutation<Post, Error, { title: string; body: string; userId: number }, // Type of variables passed to mutate
        { previousPosts: Post[] | undefined }
    >({
        mutationFn: addPostData,
        onMutate: async (newPostData) => {
            await queryClient.cancelQueries({ queryKey: ['Posts'] });
            const previousPosts = queryClient.getQueryData<Post[]>(['Posts']);
            const maxId = previousPosts?.reduce((max, post) => Math.max(max, post.id || 0), 0) || 0;
            const nextId = maxId + 1;
            const optimisticPost: Post = {
                ...newPostData,
                id: nextId,
                reactions: { likes: 0, dislikes: 0 },
            };
            queryClient.setQueryData<Post[]>(['Posts'], (oldData) => {
                return oldData ? [...oldData, optimisticPost] : [optimisticPost];
            });
            return { previousPosts };
        },
        onSuccess: (addedPostResult) => {
            console.log('Post added successfully (mutation finished):', addedPostResult);
        },
        onError: (err, newPostData, context) => {
            console.error('Mutation failed:', err);
            if (context?.previousPosts !== undefined) {
                queryClient.setQueryData<Post[]>(['Posts'], context.previousPosts);
            }
            alert(`Failed to add post: ${err.message}`);
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

    const sortedPosts = useMemo(() => {
        if (!posts) return [];
        const sortablePosts = [...posts];

        sortablePosts.sort((a, b) => {
            let comparison = 0;
            const aValue = a[sortBy as keyof Post];
            const bValue = b[sortBy as keyof Post];

            if (sortBy === 'id') {
                comparison = (aValue as number) - (bValue as number);
            } else if (sortBy === 'likes' || sortBy === 'dislikes') {
                const aReactions = a.reactions?.[sortBy] ?? 0;
                const bReactions = b.reactions?.[sortBy] ?? 0;
                comparison = aReactions - bReactions;
            }
            else if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else {
                if (aValue < bValue) comparison = -1;
                if (aValue > bValue) comparison = 1;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return sortablePosts;
    }, [posts, sortBy, sortOrder]);

    if (isAddingPost) return <p className="text-center text-green-600">Adding new post...</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {isAddPostError && <p className="text-red-500 text-center mb-4">Error adding post: {error?.message}</p>}

            <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-md text-black max-w-xl m-auto">
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
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAddingPost || !newPostTitle || !newPostBody}
                >
                    {isAddingPost ? 'Adding...' : 'Add Post'}
                </button>
            </div>

            <div className="mb-4 flex items-center justify-center gap-4 text-black">
                <label htmlFor="sort-by" className="block text-gray-700 text-sm font-bold">Sort By:</label>
                <select
                    id="sort-by"
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                    <option value="body">Body</option>
                    <option value="likes">Likes</option>
                    <option value="dislikes">Dislikes</option>
                </select>

                <label htmlFor="sort-order" className="block text-gray-700 text-sm font-bold">Order:</label>
                <select
                    id="sort-order"
                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {isPending ? (
                <p className='text-blue-600 text-lg bg-white p-3 rounded-md text-center'>Loading Posts....</p>
            ) : isError ? (
                <p className='text-red-500 text-center'>An error occurred while fetching posts.</p>
            ) : sortedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
                    {sortedPosts.map((post: Post) => (
                        <div
                            key={post.id}
                            className="relative bg-white border border-gray-200 rounded-xl shadow-md py-10 px-6 max-w-md transition-transform hover:scale-105 cursor-pointer"
                        >
                            <div className="absolute top-3 right-3 bg-gray-100 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                                👍 {post.reactions?.likes ?? 0} | 👎 {post.reactions?.dislikes ?? 0}
                            </div>

                            <h4 className="text-lg font-semibold mb-2">#{post.id} - {post.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="col-span-full text-center text-gray-500">No posts found.</p>
            )}
        </div>
    );
};

export default Product;