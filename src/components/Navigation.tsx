'use client'

import {
  Box,
  Flex,
  Text,
  Stack,
  Link,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '@/lib/languageContext'

export default function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()
  
  const isActive = (path: string) => pathname === path

  // Di chuyển tất cả useColorModeValue lên cấp cao nhất
  const bgColor = useColorModeValue('white', '#121212')
  const textColor = useColorModeValue('black', 'white')
  const borderColor = useColorModeValue('#eee', '#333')
  const hoverBg = useColorModeValue('#f2f2f2', '#333')
  const activeBg = useColorModeValue('#eee', '#333')

  return (
    <Box>
      <Flex
        bg={bgColor}
        color={textColor}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={borderColor}
        align={'center'}>
        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
          <Link as={NextLink} href="/">
            <Text
              fontFamily={'heading'}
              color={textColor}
              fontWeight="bold"
              fontSize="xl">
              TradingJ
            </Text>
          </Link>
        </Flex>

        <Stack direction={'row'} spacing={4} align="center">
          <Link
            as={NextLink}
            href="/"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: hoverBg,
            }}
            bg={isActive('/') ? activeBg : 'transparent'}
            fontWeight={isActive('/') ? 'bold' : 'normal'}>
            {t('nav.dashboard')}
          </Link>
          <Link
            as={NextLink}
            href="/trades"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: hoverBg,
            }}
            bg={isActive('/trades') ? activeBg : 'transparent'}
            fontWeight={isActive('/trades') ? 'bold' : 'normal'}>
            {t('nav.trades')}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </Stack>
      </Flex>
    </Box>
  )
}