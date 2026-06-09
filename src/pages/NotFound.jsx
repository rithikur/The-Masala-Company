import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'

const NotFound = () => {
  return (
    <PageWrapper>
      <section className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
        {/* Decorative top line */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-12 bg-turmeric/40" />
          <span className="font-body text-xs tracking-[0.25em] uppercase text-turmeric/70">
            404
          </span>
          <span className="h-px w-12 bg-turmeric/40" />
        </div>

        {/* Large 404 */}
        <h1
          className="font-display font-black leading-none text-turmeric select-none"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', letterSpacing: '-0.04em' }}
          aria-label="Page not found"
        >
          404
        </h1>

        {/* Message */}
        <div className="mt-4 mb-10 space-y-2 max-w-sm">
          <p className="font-accent italic text-2xl text-spice-brown">
            A spice trail gone astray.
          </p>
          <p className="font-body text-sm text-charcoal-muted leading-relaxed">
            This page wandered off into the spice trail. Perhaps it's lost somewhere between the cardamom hills and the pepper coast.
          </p>
        </div>

        {/* CTA */}
        <Link to="/" aria-label="Go back to the homepage">
          <Button variant="outline" size="lg">
            Return to Homepage
          </Button>
        </Link>
      </section>
    </PageWrapper>
  )
}

export default NotFound
