import { Box } from "@chakra-ui/react"
import Header from "@/components/ui/header/Header"
import "./globals.css"

import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Header>
            {children}
          </Header>
        </Providers>
      </body>
    </html>
  )
}