import axios, { AxiosRequestConfig } from "axios"

export const fetchDataOnServer = async<T>(endpoint: string, init?: AxiosRequestConfig): Promise<T> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
        const response = await axios<T>(url, init);
        return response.data
    } catch (error: any) {
        if (error.response) {
            const message = error.response.data?.message || `Failed to fetch, server responded with status: ${error.response.status}`;
            return Promise.reject(new Error(message))
        }
        else {
            return Promise.reject(new Error('error.message'))
        }
    }
}