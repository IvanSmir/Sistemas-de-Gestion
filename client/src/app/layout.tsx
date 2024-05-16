import "./globals.css"
import React from "react";
import { Providers } from './providers'
import { Box, Flex } from '@chakra-ui/react';
import Header from "@/components/ui/header/Header";
export default function RootLayout({ children, pageTitle }: Readonly<{ children: React.ReactNode; pageTitle: string;}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
            <Box>
               <Header children={children} />
            </Box>
        </Providers>
      </body>
    </html>
  );
}