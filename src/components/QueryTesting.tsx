'use client'
import { useQuery } from "@tanstack/react-query";
import refresh from '../../public/icons8-reload.gif'
import Image from "next/image";

// Fetch functions
const getTodo = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    return await response.json();
};

const getUsers = async () => {
    const res = await fetch("https://jsonplaceholder.typicodse.com/users");
    return await res.json();
};

const QueryStatus = ({ status, failureCount, errorUpdatedAt, isStale }: any) => (
    <div className="text-black">
        <p>Status: {status}</p>
        <p>Failure Count: {failureCount}</p>
        <p>Last Error Update: {errorUpdatedAt}</p>
        {isStale !== undefined && <p>Is Data Stale: {isStale ? "Yes" : "No"}</p>}
    </div>
);

const DataDisplay = ({ data, isPending, isFetching, isError, error, isSuccess, render }: any) => (
    <>
        {isPending ? (
            <p className="text-gray-600">Loading...</p>
        ) : isFetching ? (
            <p className="text-gray-600">Fetching...</p>
        ) : isError ? (
            <p className="text-red-600">Error: {error.message}</p>
        ) : isSuccess ? (
            render(data)
        ) : (
            <p>No data available</p>
        )}
    </>
);

function QueryTesting() {
    // Todos Query
    const {
        data: todoData,
        isPending: isTodoPending,
        isFetching: isTodoFetching,
        isError: isTodoError,
        error,
        failureCount: todoFailureCount,
        errorUpdatedAt: todoErrorUpdatedAt,
        status: todoStatus,
        refetch: refetchTodos,
        isSuccess: isTodoSuccess,
        isStale: isTodoStale,
    } = useQuery({
        queryKey: ["todos"],
        queryFn: getTodo,
        retry: 3, // Retry 3 times if failed
        staleTime: 10000, // 10 seconds fresh time
        refetchInterval: 60000, // Refetch every minute
        refetchOnWindowFocus: true, // Refetch when window is focused
    });

    // Users Query
    const {
        data: userData,
        isPending: isUserPending,
        isFetching: isUserFetching,
        isError: isUserError,
        error: userError,
        failureCount: userFailureCount,
        errorUpdatedAt: userErrorUpdatedAt,
        refetch: refetchUsers,
        status: userStatus,
        isSuccess: isUserSuccess,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        retry: 2, // Retry up to 10 times if failed
        staleTime: 30000, // 30 seconds fresh time
        refetchIntervalInBackground: true, // Allow background refetch
        refetchOnWindowFocus: false, // Disable refetch on window focus
    });

    return (
        <div className="p-6 flex justify-around flex-wrap">
            {/* Todos Section */}
            <div>
                <DataDisplay
                    isPending={isTodoPending}
                    isFetching={isTodoFetching}
                    isError={isTodoError}
                    error={error}
                    isSuccess={isTodoSuccess}
                    data={todoData}
                    render={(data: any) => (
                        <div className="bg-white p-4 rounded shadow mb-4">
                            <pre className="text-sm text-gray-800">
                                {JSON.stringify(data.slice(0, 5), null, 2)}
                            </pre>
                        </div>
                    )}
                />
                <button
                    onClick={() => refetchTodos()}
                    className="mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
                >
                    Refetch Todos
                </button>
                <QueryStatus
                    status={todoStatus}
                    failureCount={todoFailureCount}
                    errorUpdatedAt={todoErrorUpdatedAt}
                    isStale={isTodoStale}
                />
            </div>

            {/* Users Section */}
            <div className="w-2xl bg-[#ffffff] rounded p-3 h-fit">
                <h2 className="text-2xl font-bold mb-4 text-green-700">Users</h2>
                <DataDisplay
                    isPending={isUserPending}
                    isFetching={isUserFetching}
                    isError={isUserError}
                    error={userError}
                    isSuccess={isUserSuccess}
                    data={userData}
                    render={(data: any) => (
                        <div className="space-y-4 mb-4">
                            {data.slice(0, 5).map((val: any) => (
                                <div
                                    key={val.id}
                                    className="bg-white p-4 rounded shadow border border-gray-200"
                                >
                                    <p className="text-lg font-medium text-gray-900">Hello {val.name}</p>
                                    <p className="text-gray-700">{val.email}</p>
                                </div>
                            ))}
                        </div>
                    )}
                />
                <button
                    onClick={() => refetchUsers()}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                >
                    Refetch Users
                </button>
                <QueryStatus
                    status={userStatus}
                    failureCount={userFailureCount}
                    errorUpdatedAt={userErrorUpdatedAt}
                />
            </div>
        </div>
    );
}

export default QueryTesting;
