'use client';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface WarningType {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: WarningType;
}

export default function Todos() {
    const [title, setTitle] = useState('');
    const queryClient = useQueryClient();

    const updateWarning = async ({ id, newTitle }: { id: number; newTitle: string }): Promise<ApiResponse> => {
        const response = await axios.put(
            `https://debugged-pro.com/backend/api/warning/update-warning-type/${id}`,
            { title: newTitle }
        );
        return response.data;
    };

    const patchMutation = useMutation({
        mutationFn: updateWarning,
        onSuccess: () => {
            queryClient.invalidateQueries(['warning'] as InvalidateQueryFilters<['warning']>);
            setTitle('');
        },
    });

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10 min-h-[150px]">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Warning Data</h2>
            <div className="flex flex-col items-start justify-between  mb-4">
                <p className="text-black mb-1">Update Title:</p>
                <div className="mt-1 flex gap-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-600 rounded px-2 py-1 text-black"
                        placeholder="Enter new title"
                    />
                    <button
                        className="text-green-800 text-sm px-3 py-1 rounded bg-[#32323240] cursor-pointer"
                        onClick={() => patchMutation.mutate({ id: 5, newTitle: title })}
                        disabled={patchMutation.isPending || !title.trim()}
                    >
                        {patchMutation.isPending ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
}
