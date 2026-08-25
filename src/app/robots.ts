import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Ganti dengan URL domain produksi yang sebenarnya jika sudah ada (contoh: https://creafyindustries.com)
  const baseUrl = 'https://creafy-industries.vercel.app' 
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workshop-creafy/', '/workshop-creafy/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
