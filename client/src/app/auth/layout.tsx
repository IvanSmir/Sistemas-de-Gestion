// /auh/login/layout.tsx
'use client'
import { useRouter } from "next/navigation"
import "../globals.css"
import { useContext, useEffect } from "react"
import { useAuth } from "@/components/context/AuthProvider";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const { user, isLoading, error, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push('/');
        } else if (!isLoading && !user) {
            router.push('/auth/login')
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    console.log('LoginLayout')
    return (

        <div className='w flex justify-center h-screen items-center'>
            {children}
        </div>
    )
}
