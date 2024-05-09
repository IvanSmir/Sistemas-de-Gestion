import "./globals.css";
import { NavBar } from "@/components/ui/NavBar/NavBar";
import { Header } from "@/components/ui/header/Header";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const theme = extendTheme({
    "colors": {
      "pink": {
        "50": "#F7EEF0",
        "100": "#E7CFD6",
        "200": "#D8B0BC",
        "300": "#C992A2",
        "400": "#BA7388",
        "500": "#AB546D",
        "600": "#894358",
        "700": "#663342",
        "800": "#44222C",
        "900": "#221116"
      }
    }
  })

  return (
        <ChakraProvider theme={theme}>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <NavBar/>
          <div className="flex flex-col">
            <Header/>
            {children}
          </div>
        </div>
      </ChakraProvider>  
  );
}
