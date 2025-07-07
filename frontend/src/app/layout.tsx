import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/theme'
import { ReactQueryProvider } from '@/providers/react-query'
import { ReduxProvider } from '@/providers/redux'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stream Flow',
  description: 'Discover and share AI-powered video content effortlessly.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7320DD"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.svg" />
          <title>Stream Flow</title>
          <meta name="description" content="Discover and share AI-powered video content effortlessly." />
        </head>
        <body className={`${manrope.className} bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}