"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        setName("")
        setEmail("")
        setPassword("")
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black flex-1">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
                <form className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                            required
                        />

                    </div>
                    <p className="text-[#7a869a] text-sm sm:text-base"> Already have account? <Link href="/signIn" className="underline">Sign In</Link></p>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition "
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </button>
                </form>
                <p> Name : {name}<br />
                    Email: {email} <br />
                    Password:{password}</p>

            </div>
        </div>
    );
}
