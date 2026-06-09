import React from 'react'
import PageWrapper from '../components/layout/PageWrapper'

const ComingSoon = () => {
  return (
    <PageWrapper>
      <section className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-turmeric/40" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-turmeric/80">
              Coming Soon
            </span>
            <span className="h-px w-8 bg-turmeric/40" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-spice-brown">
            This Page is Being Prepared
          </h1>
          <p className="font-body text-sm text-charcoal-muted leading-relaxed">
            Like a perfectly blended masala, great things take time. Check back soon.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default ComingSoon
