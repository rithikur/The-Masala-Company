import React from 'react'
import { Helmet } from 'react-helmet-async'
import { APP_NAME, APP_TAGLINE } from '../../utils/constants'

const SEOHead = ({
  title,
  description = `${APP_NAME} — ${APP_TAGLINE}. Premium handcrafted spices sourced directly from Indian farms.`,
  canonical,
  ogImage,
}) => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

export default SEOHead
