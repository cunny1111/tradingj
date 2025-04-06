'use client'

import { useState } from 'react'
import {
  Box, 
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Flex,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel
} from '@chakra-ui/react'
import { useStore } from '@/lib/store'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PerformanceChart from '@/components/PerformanceChart'
import { useLanguage } from '@/lib/languageContext'

export default function Page() {
  const { t } = useLanguage()
  
  const { 
    initialAccount, 
    trades, 
    setInitialAccount,
    calculateMonthlyPL,  // Xóa calculateDailyPL vì không dùng
    calculateYearlyPL,
    calculateWinRate,
    calculateAverageRR
  } = useStore()
  
  const [editAmount, setEditAmount] = useState(initialAccount.toString())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthPL = calculateMonthlyPL(currentYear, currentMonth)
  const thisYearPL = calculateYearlyPL(currentYear)
  const winRate = calculateWinRate()
  const averageRR = calculateAverageRR()
  
  // Calculate account value based on initial and all trades
  const accountValue = trades.reduce((total, trade) => {
    return total + trade.profitLossAmount;
  }, initialAccount)
  
  // Calculate the total profits/losses in currency
  const totalProfitLoss = accountValue - initialAccount
  
  // Calculate the percentage change
  const percentageChange = (totalProfitLoss / initialAccount) * 100
  
  const handleUpdateInitialAccount = () => {
    const amount = parseFloat(editAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('dashboard.invalidAmount'),
        description: t('dashboard.enterValidNumber'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    
    setInitialAccount(amount)
    onClose()
    
    toast({
      title: t('dashboard.accountUpdated'),
      description: `${t('dashboard.initialAccountSet')} ${formatCurrency(amount)}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" mb={6}>{t('dashboard.title')}</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Card>
          <CardHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md">{t('dashboard.account')}</Heading>
              <Button size="sm" onClick={onOpen}>{t('dashboard.edit')}</Button>
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <Stat>
              <StatLabel>{t('dashboard.currentValue')}</StatLabel>
              <StatNumber>{formatCurrency(accountValue)}</StatNumber>
              <StatHelpText>
                <StatArrow type={percentageChange >= 0 ? 'increase' : 'decrease'} />
                {formatPercentage(percentageChange)}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <Heading size="md">{t('dashboard.winRate')}</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Stat>
              <StatLabel>{t('dashboard.overall')}</StatLabel>
              <StatNumber>{winRate.toFixed(1)}%</StatNumber>
              <StatHelpText>
                {trades.length} {t('dashboard.trades')}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <Heading size="md">{t('dashboard.performance')}</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Stat>
              <StatLabel>{t('dashboard.thisMonth')}</StatLabel>
              <StatNumber>
                <StatArrow type={thisMonthPL >= 0 ? 'increase' : 'decrease'} />
                {formatCurrency(thisMonthPL)}
              </StatNumber>
              <StatHelpText>
                {t('dashboard.thisYear')}: {formatCurrency(thisYearPL)}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <Heading size="md">{t('dashboard.riskReward')}</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Stat>
              <StatLabel>{t('dashboard.averageRR')}</StatLabel>
              <StatNumber>{averageRR.toFixed(2)}R</StatNumber>
              <StatHelpText>
                {t('dashboard.totalPL')}: {formatCurrency(totalProfitLoss)}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <Box mb={8}>
        <Heading size="md" mb={4}>{t('dashboard.performanceChart')}</Heading>
        <Tabs>
          <TabList>
            <Tab>{t('dashboard.monthly')}</Tab>
            <Tab>{t('dashboard.yearly')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <PerformanceChart period="month" />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <PerformanceChart period="year" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('dashboard.updateAccount')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <InputLeftAddon>VNĐ</InputLeftAddon>
              <Input
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="Enter amount"
                type="number"
              />
            </InputGroup>
            <Text mt={2} fontSize="sm">
              {t('dashboard.depositNote')}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateInitialAccount}>
              {t('dashboard.update')}
            </Button>
            <Button variant="ghost" onClick={onClose}>{t('dashboard.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}