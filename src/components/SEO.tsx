import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  schema?: Record<string, any>
}

export function SEO({ title, description, keywords, image, url, schema }: SEOProps) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const baseUrl = 'https://kpl-services.com'
  const defaultImage = 'https://i.postimg.cc/vZQQ6y8s/logo.png'
  const fullUrl = `${baseUrl}${url || ''}`

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{title} | KPL SERVICES</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="KPL SERVICES" />
      <link rel="canonical" href={fullUrl} />

      {/* Hreflang for i18n SEO */}
      <link rel="alternate" hrefLang="fr" href={fullUrl} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${url || ''}`} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | KPL SERVICES`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="KPL SERVICES" />
      <meta property="og:locale" content={currentLang === 'fr' ? 'fr_TG' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kplservices" />
      <meta name="twitter:creator" content="@kplservices" />
      <meta name="twitter:title" content={`${title} | KPL SERVICES`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
