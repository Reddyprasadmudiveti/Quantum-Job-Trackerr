import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import baseConfig from './vite.config.js'

// Extend base config with bundle analyzer
export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    // Bundle analyzer plugin
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // or 'sunburst', 'network'
    })
  ],
  build: {
    ...baseConfig.build,
    // Generate more detailed analysis
    rollupOptions: {
      ...baseConfig.build.rollupOptions,
      output: {
        ...baseConfig.build.rollupOptions.output,
        // More detailed chunk analysis
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor'
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor'
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor'
            }
            if (id.includes('axios')) {
              return 'http-vendor'
            }
            return 'vendor'
          }
          
          // App chunks by feature
          if (id.includes('/components/homepage/')) {
            return 'homepage'
          }
          if (id.includes('/pages/Authentication/')) {
            return 'auth'
          }
          if (id.includes('/pages/Admin/')) {
            return 'admin'
          }
          if (id.includes('/pages/User/')) {
            return 'user'
          }
        }
      }
    }
  }
})