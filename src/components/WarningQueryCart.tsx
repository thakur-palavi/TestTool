'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function WarningQueryCart() {
    const fetchWarningData = async () => {
        const response = await axios.get(`https://debugged-pro.com/backend/api/warning/get-warning-type-detail/5`);
        return response.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['warning'],
        queryFn: fetchWarningData,
        staleTime: 20000
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data: {JSON.stringify(error)}</div>;
    if (!data) return <div>No data found.</div>;

    return (
        <div className="mt-8 flex flex-col">
            <div className="max-w-4xl border-l-2 border-amber-400 rounded-sm bg-[#ffffff30] h-full w-full mb-1.5 p-3 cursor-pointer m-auto">
                <strong>{data.data.id}. </strong>
                <strong>{data.data.title}</strong>
                <br />
                {data.data.description || "No description provided."}
            </div>
        </div>
    );
}

export default WarningQueryCart;
