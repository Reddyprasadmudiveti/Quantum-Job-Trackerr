import React from 'react'

const PageNotFound = () => {
    return (
        <div className="min-h-screen w-screen flex flex-col justify-center items-center px- relative">
            {/* Animated background elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-20 left-20 w-60 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse'></div>
                <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500'></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
                <div className='bg-white/10 backdrop-blur-lg border scale-60 border-white/20 rounded-3xl p-12 shadow-2xl transform hover:scale-65 transition-all duration-300'>
                    {/* 404 Icon */}
                    <div className='w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <span className='text-4xl text-white'>🔍</span>
                    </div>

                    {/* 404 Number */}
                    <h1 className="text-9xl font-bold text-white/20 mb-4 drop-shadow-lg">404</h1>

                    {/* Title */}
                    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Page Not Found</h2>

                    {/* Description */}
                    <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital void.
                        Don't worry, we'll help you find your way back.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/20"
                        >
                            ← Go Back
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                        >
                            🏠 Home Page
                        </button>
                    </div>
                </div>

                {/* Additional Help Text */}
                <div className='mt-8'>
                    <p className='text-white/60 text-sm'>
                        If you believe this is an error, please{' '}
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className='text-purple-300 hover:text-purple-200 transition-colors underline'
                        >
                            contact support
                        </button>
                    </p>
                </div>
            </div>

            {/* Floating decorative elements */}
            <div className='absolute top-32 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500'>
                <div className='w-24 h-24 bg-gradient-to-br from-red-400/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
            </div>
            <div className='absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500'>
                <div className='w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
            </div>
            <div className='absolute top-1/4 right-1/4 transform rotate-45 hover:rotate-0 transition-transform duration-700'>
                <div className='w-16 h-16 bg-gradient-to-br from-pink-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
            </div>
        </div>
    )
}

export default PageNotFound