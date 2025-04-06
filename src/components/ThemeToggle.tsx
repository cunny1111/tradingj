'use client'

import { Button, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button
      aria-label="Toggle dark mode"
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
    >
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
} 