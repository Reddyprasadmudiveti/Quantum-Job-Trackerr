import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { buildConfig, chunkStrategy } from './build.config.js'

export default defineConfig(({ mode }) => {
  const config = buildConfig[mode] || buildConfig.production
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    
    // Build configuration for production optimization
    build: {
      // Output directory for built files
      outDir: 'dist',
      
      // Generate source maps for debugging in production
      sourcemap: config.sourcemap,
      
      // Minify the output
      minify: config.minify,
      
      // Target modern browsers for better optimization
      target: config.target,
      
      // Asset handling
      assetsDir: 'assets',
      
      // Rollup options for advanced bundling
      rollupOptions: {
        // Code splitting configuration
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // React core
            react: chunkStrategy.react,
            // Router
            router: chunkStrategy.router,
            // UI libraries chunk
            ui: chunkStrategy.ui,
            // 3D libraries chunk (if used)
            three: chunkStrategy.three,
            // Utility libraries chunk
            utils: chunkStrategy.utils,
            // Google APIs chunk
            google: chunkStrategy.google
          },
          
          // Asset file naming for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            }
            
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            
            return `assets/[name]-[hash][extname]`
          },
          
          // Chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },
      
      // Chunk size warning limit
      chunkSizeWarningLimit: config.chunkSizeWarningLimit,
      
      // Enable CSS code splitting
      cssCodeSplit: true,
      
      // Report compressed size
      reportCompressedSize: true,
      
      // Emit manifest for asset tracking
      manifest: true
    },
    
    // Preview configuration for production testing
    preview: {
      port: 4173,
      host: true,
      cors: true
    },
    
    // Development server configuration
    server: {
      port: 5173,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        },
        '/auth': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          // Exclude frontend auth routes from being proxied
          bypass: (req, res, options) => {
            // Don't proxy frontend auth routes - let React Router handle them
            if (req.url.startsWith('/auth/success')) {
              return req.url
            }
          }
        }
      }
    },
    
    // Asset optimization
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.avif'],
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: JSON.stringify(mode === 'development')
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'zustand'
      ],
      exclude: [
        // Exclude large libraries from pre-bundling
        'three',
        '@react-three/fiber',
        '@react-three/drei'
      ]
    }
  }
})