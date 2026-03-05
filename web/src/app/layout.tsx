import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata = {
  title: 'ProximityJobs',
  description: 'Location-aware Job Board',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
