'use client'

import { Button, Menu, MenuButton, MenuList, MenuItem, useColorModeValue } from '@chakra-ui/react'
import { useLanguage } from '@/lib/languageContext'

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  
  const buttonBg = useColorModeValue('#f2f2f2', '#333')
  const buttonHoverBg = useColorModeValue('#eee', '#444')
  
  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="outline"
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
      >
        {language === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}
      </MenuButton>
      <MenuList borderColor={useColorModeValue('#eee', '#333')}>
        <MenuItem 
          onClick={() => setLanguage('en')}
          fontWeight={language === 'en' ? 'bold' : 'normal'}
        >
          🇺🇸 {t('language.en')}
        </MenuItem>
        <MenuItem 
          onClick={() => setLanguage('vi')}
          fontWeight={language === 'vi' ? 'bold' : 'normal'}
        >
          🇻🇳 {t('language.vi')}
        </MenuItem>
      </MenuList>
    </Menu>
  )
} 