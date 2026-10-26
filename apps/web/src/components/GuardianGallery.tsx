import { lazy, Suspense } from 'react'

const GuardianCarousel = lazy(() => import('./GuardianCarousel').then(module => ({ default: module.GuardianCarousel })))

// Keep the same three-figure composition and accessible controls at every size.
export function GuardianGallery() {
  return <div className="guardian-gallery gallery-cloud-court">
    <Suspense fallback={<div className="guardian-stage"/>}><GuardianCarousel/></Suspense>
  </div>
}
