'use client'
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { useRouter } from 'next/navigation'; // Import useRouter for programmatic navigation

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const { data: session, status } = useSession(); // Get the session info
    const router = useRouter(); // Initialize useRouter for navigation

    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard'); // Redirect to dashboard
        }
    }, [status, router]);

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setMessage(result.error);
        } else {
            router.push('/dashboard');  // Redirect to dashboard after successful login
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Sign In
                </button>
                {message && (
                    <p className="text-center text-red-500 mt-4">{message}</p>
                )}
            </form>

            {/* Sign-up link */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account yet?{' '}
                    <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
