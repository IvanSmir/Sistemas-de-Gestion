// /auh/login/layout.tsx
'use client'
import { useRouter } from "next/navigation"
import "../globals.css"
import { useContext } from "react"
import { AuthContext } from "@/components/context"

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    const router = useRouter()
    const { logged } = useContext(AuthContext)
    if (logged) {
        router.push('/')
    }
    console.log('LoginLayout')
    return (

        <div className='w flex justify-center h-screen items-center'>
            {children}
        </div>
    )
}
