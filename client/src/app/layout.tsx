import "./globals.css"
import React from "react";
import { NavBar } from "@/components/ui/NavBar/NavBar";
import { Header } from "@/components/ui/header/Header";
import { Providers } from './providers'
import { SideBar } from "@/components/ui/NavBar/SideBar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <SideBar />

            <div className="flex flex-col">
              <Header />
              {children}
            </div>
          </div>

        </Providers>

      </body>
    </html>

  );
}
