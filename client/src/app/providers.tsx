'use client'

import { AuthProvider } from '@/components/context'
import { ChakraProvider } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ChakraProvider>
    )
}