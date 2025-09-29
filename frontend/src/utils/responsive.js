// Responsive utility functions and constants

// Breakpoint constants (matching Tailwind CSS defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

// Common responsive class combinations
export const RESPONSIVE_CLASSES = {
  // Container classes
  container: 'responsive-container',
  padding: 'responsive-px',
  verticalPadding: 'py-8 sm:py-12 lg:py-16',
  
  // Typography
  heading1: 'text-3xl sm:text-4xl lg:text-6xl',
  heading2: 'text-2xl sm:text-3xl lg:text-5xl',
  heading3: 'text-xl sm:text-2xl lg:text-3xl',
  heading4: 'text-lg sm:text-xl lg:text-2xl',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  
  // Buttons
  button: 'responsive-button touch-target',
  buttonSmall: 'px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl',
  buttonLarge: 'px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl',
  
  // Cards
  card: 'rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8',
  cardSmall: 'rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6',
  
  // Grids
  grid1to2: 'grid grid-cols-1 sm:grid-cols-2',
  grid1to3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  grid2to4: 'grid grid-cols-2 lg:grid-cols-4',
  gridGap: 'gap-4 sm:gap-6 lg:gap-8',
  gridGapSmall: 'gap-3 sm:gap-4 lg:gap-6',
  
  // Spacing
  marginBottom: 'mb-6 sm:mb-8 lg:mb-12',
  marginBottomSmall: 'mb-4 sm:mb-6 lg:mb-8',
  marginTop: 'mt-6 sm:mt-8 lg:mt-12',
  
  // Flexbox
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-col sm:flex-row',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex justify-between items-center',
  flexGap: 'gap-4 sm:gap-6',
  flexGapSmall: 'gap-2 sm:gap-4',
  
  // Forms
  input: 'responsive-form-input',
  select: 'responsive-form-input',
  
  // Modal
  modal: 'responsive-modal',
  
  // Navigation
  navLink: 'px-3 py-2 lg:px-5 lg:py-2.5 rounded-lg lg:rounded-xl text-sm lg:text-base',
  mobileNavLink: 'px-4 py-3 rounded-xl touch-friendly',
  
  // Images
  avatar: 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20',
  avatarLarge: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
  icon: 'w-5 h-5 sm:w-6 sm:h-6',
  iconLarge: 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12'
}

// Utility functions
export const getResponsiveClasses = (...classNames) => {
  return classNames.filter(Boolean).join(' ')
}

export const combineResponsiveClasses = (baseClasses, responsiveClasses) => {
  return `${baseClasses} ${responsiveClasses}`
}

// Hook for detecting screen size (if needed)
export const useScreenSize = () => {
  if (typeof window === 'undefined') return 'lg' // SSR fallback
  
  const width = window.innerWidth
  
  if (width < BREAKPOINTS.sm) return 'xs'
  if (width < BREAKPOINTS.md) return 'sm'
  if (width < BREAKPOINTS.lg) return 'md'
  if (width < BREAKPOINTS.xl) return 'lg'
  if (width < BREAKPOINTS['2xl']) return 'xl'
  return '2xl'
}

// Media query helpers
export const mediaQueries = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  
  // Max width queries
  maxSm: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  maxMd: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  maxLg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  maxXl: `(max-width: ${BREAKPOINTS.xl - 1}px)`,
}

// Common responsive patterns
export const RESPONSIVE_PATTERNS = {
  // Hero section
  hero: {
    container: getResponsiveClasses(
      RESPONSIVE_CLASSES.container,
      RESPONSIVE_CLASSES.padding,
      'py-8 sm:py-12 lg:py-16'
    ),
    title: getResponsiveClasses(
      RESPONSIVE_CLASSES.heading1,
      'font-bold text-center mb-4 sm:mb-6'
    ),
    subtitle: getResponsiveClasses(
      'text-base sm:text-lg lg:text-xl',
      'text-center mb-6 sm:mb-8'
    ),
    buttons: getResponsiveClasses(
      'flex flex-col sm:flex-row',
      'gap-4 sm:gap-6',
      'w-full sm:w-auto'
    )
  },
  
  // Feature cards
  features: {
    container: getResponsiveClasses(
      RESPONSIVE_CLASSES.grid1to3,
      RESPONSIVE_CLASSES.gridGap
    ),
    card: getResponsiveClasses(
      RESPONSIVE_CLASSES.card,
      'text-center'
    ),
    icon: getResponsiveClasses(
      RESPONSIVE_CLASSES.iconLarge,
      'mx-auto mb-4 sm:mb-6'
    ),
    title: getResponsiveClasses(
      RESPONSIVE_CLASSES.heading4,
      'font-bold mb-3 sm:mb-4'
    ),
    description: getResponsiveClasses(
      RESPONSIVE_CLASSES.body,
      'leading-relaxed'
    )
  },
  
  // Navigation
  nav: {
    container: getResponsiveClasses(
      'flex justify-between items-center',
      'p-3 sm:p-4 lg:p-6'
    ),
    logo: getResponsiveClasses(
      'flex items-center gap-2 sm:gap-4'
    ),
    menu: getResponsiveClasses(
      'hidden lg:flex gap-4 xl:gap-6 items-center'
    ),
    mobileButton: getResponsiveClasses(
      'lg:hidden p-2 rounded-lg',
      RESPONSIVE_CLASSES.button
    )
  },
  
  // Forms
  form: {
    container: getResponsiveClasses(
      RESPONSIVE_CLASSES.card,
      'max-w-2xl mx-auto'
    ),
    grid: getResponsiveClasses(
      'grid grid-cols-1 sm:grid-cols-2',
      RESPONSIVE_CLASSES.gridGap
    ),
    input: RESPONSIVE_CLASSES.input,
    button: getResponsiveClasses(
      RESPONSIVE_CLASSES.button,
      'w-full sm:w-auto'
    )
  }
}

export default {
  BREAKPOINTS,
  RESPONSIVE_CLASSES,
  RESPONSIVE_PATTERNS,
  getResponsiveClasses,
  combineResponsiveClasses,
  useScreenSize,
  mediaQueries
}