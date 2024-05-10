import "./globals.css"
import React from "react";
import { Header } from "@/components/ui/header/Header";
import { Providers } from './providers'
import { SideBar } from "@/components/ui/NavBar/SideBar";
import { Flex } from '@chakra-ui/react';
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Flex h="100vh" flexDirection="row">
            <div>
              <SideBar />
            </div>
            <Flex flexDirection="column" flex="1">
              <div>
                <Header />
              </div>
              <div style={{ flex: "1", overflowY: "auto" }}>
                {children}
              </div>
            </Flex>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}