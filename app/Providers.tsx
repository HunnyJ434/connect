'use client';

import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar"
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider><Navbar/>{children}</SessionProvider>;
};
