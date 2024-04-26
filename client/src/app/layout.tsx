import "./globals.css";
import { NavBar } from "@/components/ui/NavBar/NavBar";
import { Header } from "@/components/ui/header/Header";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <NavBar/>
          <div className="flex flex-col">
            <Header/>
            {children}
          </div>
        </div>
  );
}
