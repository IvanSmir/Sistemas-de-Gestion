import "./globals.css";
import { ChakraProvider, Box, Grid } from "@chakra-ui/react";
import { NavBar } from "@/components/ui/NavBar/NavBar";
import { Header } from "@/components/ui/header/Header";
import { SiberBar } from "@/components/ui/NavBar/SiberBar";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <SiberBar/>
    </ChakraProvider>
  );
}
