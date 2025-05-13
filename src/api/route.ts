import axios from "axios"
import { error } from "console"
import { title } from "process"

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
})

//  useQuery (only for get)
export const fetchPosts = (pageNumber: number) => {
    return api.get(`/posts?_start=${pageNumber}&_limit=3`)
}
export const fetchSinglePosts = (id: number) => {
    return api.get(`/posts/${id}`);
}

// useMutation (only for Put post delete)

export const deletePost = (id: any) => {
    return api.delete(`/posts/${id}`)
}

export const patchPost = (id: any) => {
    return api.patch(`/posts/${id}`, { title: 'I have updated' })
}

const url = " https://debugged-pro.com/backend/api/warning/get-warning-type-detail/5"
export const fetchWarning = async () => {
    const res = await axios.get(url);
    return res.data;
}
export const updateWarning = async (id: number) => {
    const res = await axios.put(url, { title: 'hello i am updated' });
    return res.data;
}
export const deleteWarning = async (id: number) => {
    const res = await axios.delete(`https://debugged-pro.com/backend/api/warning/get-warning-type-detail/${id}`);
    return res.data;
}
