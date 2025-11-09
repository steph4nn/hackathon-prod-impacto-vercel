/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuração para Turbopack (Next.js 16+)
  turbopack: {
    // Turbopack vazio para silenciar o aviso
    // WhatsApp será carregado via importação dinâmica nas API routes
  },
  // Mantém webpack para compatibilidade
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Marca whatsapp-web.js como external para não fazer bundle no servidor
      config.externals = config.externals || []
      config.externals.push({
        'whatsapp-web.js': 'commonjs whatsapp-web.js',
        'qrcode-terminal': 'commonjs qrcode-terminal'
      })
    }
    
    // Ignora módulos problemáticos durante o build
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'WAWebPollsVotesSchema': false,
    }
    
    return config
  },
  // Configuração adicional para server components
  experimental: {
    serverComponentsExternalPackages: ['whatsapp-web.js', 'qrcode-terminal'],
  },
}

export default nextConfig
