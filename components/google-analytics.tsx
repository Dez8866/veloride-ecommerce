'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  
  // Only render in production or when GA_MEASUREMENT_ID is set
  if (!gaId || gaId === 'G-XXXXXXXXXX') {
    return null
  }
  
  return <NextGoogleAnalytics gaId={gaId} />
}
