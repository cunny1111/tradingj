'use client'

import { ChakraProvider, extendTheme, StyleFunctionProps } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { useEffect, useState } from 'react'

// Define the color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Monochrome color palette
const colors = {
  brand: {
    50: '#f2f2f2',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: '#737373',
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#0d0d0d',
  },
  blue: {
    50: '#f2f2f2',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: '#737373',
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#0d0d0d',
  },
  green: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#38a169', // Main green color for profits
    600: '#2f855a',
    700: '#276749',
    800: '#22543d',
    900: '#1c4532',
  },
  red: {
    50: '#fff5f5',
    100: '#fed7d7',
    200: '#feb2b2',
    300: '#fc8181',
    400: '#f56565',
    500: '#e53e3e', // Main red color for losses
    600: '#c53030',
    700: '#9b2c2c',
    800: '#822727',
    900: '#63171b',
  },
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // For breakeven
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
}

// Extend the theme with color mode config
const theme = extendTheme({ 
  config,
  colors,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#121212' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'black',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: () => ({
        _focus: {
          boxShadow: 'none',
        },
      }),
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'white' : 'black',
          color: props.colorMode === 'dark' ? 'black' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? '#e0e0e0' : '#333333',
          },
        }),
        outline: (props: StyleFunctionProps) => ({
          borderColor: props.colorMode === 'dark' ? 'white' : 'black',
          color: props.colorMode === 'dark' ? 'white' : 'black',
        }),
        ghost: (props: StyleFunctionProps) => ({
          color: props.colorMode === 'dark' ? 'white' : 'black',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: StyleFunctionProps) => ({
        container: {
          bg: props.colorMode === 'dark' ? '#1e1e1e' : 'white',
          borderColor: props.colorMode === 'dark' ? '#333' : '#eee',
        },
      }),
    },
    Badge: {
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorMode === 'dark' ? 'white' : 'black',
          color: props.colorMode === 'dark' ? 'black' : 'white',
        }),
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // To avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}