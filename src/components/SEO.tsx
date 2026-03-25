import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
}

export function SEO({ title, description, keywords, image, url }: SEOProps) {
  const baseUrl = 'https://kpl-services.com'
  const defaultImage = 'https://i.postimg.cc/vZQQ6y8s/logo.png'

  return (
    <Helmet>
      <title>{title} | KPL SERVICES</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="KPL SERVICES" />
      <link rel="canonical" href={`${baseUrl}${url || ''}`} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | KPL SERVICES`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={`${baseUrl}${url || ''}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="KPL SERVICES" />
      <meta property="og:locale" content="fr_TG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | KPL SERVICES`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  )
}
