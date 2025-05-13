import { fetchSinglePosts } from "@/api/route";
import SingleFetchData from "@/components/SingleFetchData";

export async function getSinglePost(id: number) {
    try {
        const res = await fetchSinglePosts(id);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch post:", err);
        return null;
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const post = await getSinglePost(Number(params.id));
    const { title, body, id } = post;
    return (
        <SingleFetchData title={title} body={body} id={id} />
    )
}
