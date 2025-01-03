'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo with Icon */}
                    <div className="flex-shrink-0 flex items-center xl:ml-[-50px]"> {/* Reduced space-x from 2 to 1 */}
                        <img src="/icons8-no-chat-100.png" alt="Icon" className="w-12 h-12" />
                        <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
                            Connect
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex space-x-4">
                        <Link href="/" className="hover:text-gray-300">
                            Home
                        </Link>
                        {!session ? (
                            <>
                                <Link href="/signin" className="hover:text-gray-300">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="hover:text-gray-300">
                                    Sign Up
                                </Link>
                                <Link href="/anonychat" className="hover:text-gray-300">
                                    Anonymous Chat
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard" className="hover:text-gray-300">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="hover:text-gray-300"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <MobileMenu session={session} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function MobileMenu({ session }) {
    return (
        <div className="relative">
            <details className="group">
                <summary className="flex items-center cursor-pointer">
                    <svg
                        className="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                    <Link href="/" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                        Home
                    </Link>
                    {!session ? (
                        <>
                            <Link href="/signin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                Sign In
                            </Link>
                            <Link href="/signup" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                Sign Up
                            </Link>
                            <Link href="/anonychat" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                Anonymous Chat
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </details>
        </div>
    );
}
