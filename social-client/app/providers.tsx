'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="516607384733-101193hvvoqsaua0kni4e7uj62o36cr9.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}


