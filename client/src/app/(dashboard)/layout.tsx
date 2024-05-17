// /auh/login/layout.tsx
'use client'
import { useRouter } from "next/navigation"
import "../globals.css"
import { useEffect } from "react"
import { useAuth } from "@/components/context/AuthProvider";
import { SidebarWithHeader } from "@/components/ui/header/Header";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const { user, isLoading, error, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (

        <SidebarWithHeader>
            
            {children}
        </SidebarWithHeader>
    )
}
