'use client';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Project {
    title: string;
    body: string;
    userId: number;
    id: number;
}
interface CreateProjectType {
    title: string;
    userId: number;
}
interface ProjectPage {
    projects: Pick<Project, 'id' | 'title'>[];
    nextPage: number | undefined;
    prevPage: number | undefined;
    totalCount: number;
}

const PAGE_SIZE = 10;

const fetchProjects = async (pageParam: number): Promise<ProjectPage> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_SIZE}`);
    const totalCountHeader = response.headers['x-total-count'];
    const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
    const projects = response.data
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;
    const prevPage = pageParam > 1 ? pageParam - 1 : undefined;
    return { projects, nextPage, totalCount, prevPage };
};


export default function InfiniteScroll() {
    const queryClient = useQueryClient();
    const [addProject, setAddProject] = useState<string>('');
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const loadPrevRef = useRef<HTMLDivElement>(null);

    const { data, error, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetching, isFetchingNextPage, isFetchingPreviousPage, status, } = useInfiniteQuery<ProjectPage, Error>({
        queryKey: ['infiniteProjectsScroll'],
        queryFn: ({ pageParam = 1 }) => fetchProjects(pageParam as number),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        getPreviousPageParam: (firstPage) => firstPage.prevPage,
        staleTime: 1000 * 60 * 5,
    });

    const fetchNext = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const fetchPrevious = useCallback(() => {
        if (hasPreviousPage && !isFetchingPreviousPage) {
            fetchPreviousPage()
        }
    }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNext();
            }
        },
            {
                rootMargin: '30px',
                threshold: 0.1
            }
        );
        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, loadMoreRef]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
                fetchPrevious();
            }
        }, { rootMargin: '20px', threshold: 0.1 });
        const previousRef = loadMoreRef.current;
        if (previousRef) {
            observer.observe(previousRef);

        }
        return () => {
            if (previousRef) {
                observer.unobserve(previousRef);
            }
            observer.disconnect();
        };

    }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage, loadMoreRef]);

    const getDisplayPages = () => {
        if (!data) return [];
        const allPages = [...data.pages]
        return allPages
    }

    const addProjects = async (newProject: CreateProjectType) => {
        const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, newProject);
        return response.data;
    };

    const projectMutation = useMutation<any, Error, CreateProjectType>({
        mutationFn: addProjects,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['infiniteProjectsScroll'] });
            setAddProject('');
        },
        onError: (error) => {
            console.log("Error creating project : ", error);
        },
    });
    const handleProjectAdd = async () => {
        if (addProject.trim()) {
            const values: CreateProjectType = {
                title: addProject,
                userId: 1,
            };
            await projectMutation.mutateAsync(values);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10 font-sans ">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Infinite Scroll Projects</h2>
            <div className="mb-4 flex flex-col gap-2">
                <input
                    type='text'
                    className='p-2 border rounded text-black'
                    value={addProject}
                    placeholder="New project name"
                    onChange={(e) => setAddProject(e.target.value)}
                    disabled={projectMutation.isPending}
                />
                <button
                    onClick={handleProjectAdd}
                    disabled={projectMutation.isPending || !addProject.trim()}
                    className='bg-green-600 p-2 self-end rounded text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {projectMutation.isPending ? "Adding..." : "Create Project"}
                </button>
                {projectMutation.isError && (
                    <p className='text-red-500 '> Error creating project: {projectMutation.error?.message}</p>
                )}
            </div>
            {status === 'pending' ? (
                <p className='text-blue-600 text-center'>Loading initial projects...</p>
            ) : status === 'error' ? (
                <p className='text-red-500 text-center'>Error: {error.message}</p>
            ) : (
                <>
                    <div className="min-h-[200px] mb-4 border rounded p-2 bg-gray-50 overflow-y-auto max-h-[500px] h-full"> {/* Optional: add fixed height and scroll */}
                        <div ref={loadPrevRef} className='h-0.5' />
                        {isFetchingPreviousPage && (<p className='text-blue-600'> loading more</p>)}
                        {getDisplayPages().map((page, pageIndex) => (
                            <React.Fragment key={pageIndex}>
                                {page.projects.map((project) => (
                                    <p key={project.id} className="text-gray-800 py-1 border-b border-gray-200 last:border-b-0">
                                        {project.id}: {project.title}
                                    </p>
                                ))}
                            </React.Fragment>
                        ))}
                        {data.pages.length === 0 || data.pages[0].projects.length === 0 && (
                            <p className="text-gray-500 text-center">No projects found.</p>
                        )}
                        {isFetchingNextPage && (
                            <p className="text-blue-500">Loading more...</p>
                        )}
                        <div ref={loadMoreRef} className='h-0.5' />
                    </div>

                    <div className="text-center mt-4 h-6">

                        {!hasNextPage && !hasPreviousPage && data.pages.length > 0 && data.pages[0].projects.length > 0 && (
                            <p className="text-gray-500">Nothing more to load</p>
                        )}
                    </div>
                </>
            )}
            {isFetching && !isFetchingNextPage && status !== 'pending' && !isFetchingPreviousPage && (
                <div className="text-center text-sm text-blue-500 mt-2">Updating...</div>
            )}
        </div>
    );
}