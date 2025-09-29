// Build configuration for different environments
export const buildConfig = {
    development: {
        sourcemap: true,
        minify: false,
        target: 'esnext',
        chunkSizeWarningLimit: 1000
    },

    production: {
        sourcemap: true,
        minify: 'esbuild',
        target: 'es2015',
        chunkSizeWarningLimit: 500
    },

    analyze: {
        sourcemap: true,
        minify: 'esbuild',
        target: 'es2015',
        chunkSizeWarningLimit: 500,
        generateBundleAnalysis: true
    }
}

// Asset optimization settings
export const assetConfig = {
    images: {
        formats: ['webp', 'avif', 'png', 'jpg'],
        quality: 80,
        progressive: true
    },

    fonts: {
        preload: ['woff2'],
        display: 'swap'
    },

    compression: {
        gzip: true,
        brotli: true
    }
}

// Code splitting strategy
export const chunkStrategy = {
    // Core React libraries
    react: ['react', 'react-dom'],

    // Router
    router: ['react-router-dom'],

    // UI libraries
    ui: [
        '@headlessui/react',
        'framer-motion',
        'react-hot-toast',
        'react-icons'
    ],

    // 3D libraries (large, separate chunk)
    three: [
        'three',
        '@react-three/fiber',
        '@react-three/drei'
    ],

    // HTTP and state management
    utils: [
        'axios',
        'zustand'
    ],

    // Google APIs (if used)
    google: [
        '@google-cloud/local-auth',
        'googleapis'
    ]
}

// Performance budgets
export const performanceBudgets = {
    maxBundleSize: 500 * 1024, // 500KB
    maxChunkSize: 200 * 1024,  // 200KB
    maxAssetSize: 100 * 1024,  // 100KB
    maxInitialChunks: 5
}