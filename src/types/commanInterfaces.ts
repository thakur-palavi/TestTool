export interface Post {
    id: number;
    title: string;
    body: string;
    reactions: {
        likes: number;
        dislikes: number;
    };
}
export interface PostsResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}
