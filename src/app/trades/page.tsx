'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Badge,
  HStack,
  Input,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Select,
  IconButton,
  Flex,
  ButtonGroup,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon, ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useStore, Trade } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/utils'
import AddTradeForm from '@/components/AddTradeForm'
import { useLanguage } from '@/lib/languageContext'

// Define sort field types
type SortField = 'date' | 'profitLossPercentage' | 'profitLossAmount' | 'margin'
type SortOrder = 'asc' | 'desc'

export default function TradesPage() {
  const { t } = useLanguage()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const { trades, deleteTrade } = useStore()

  // Define all useColorModeValue calls at the top level
  const modalBg = useColorModeValue('white', '#121212')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const boxBg = useColorModeValue('white', '#1e1e1e')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  // Filter trades by search term
  const filteredTrades = trades.filter(trade => 
    trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.ictSetup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort trades based on selected field and order
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'profitLossPercentage':
        comparison = a.profitLossPercentage - b.profitLossPercentage;
        break;
      case 'profitLossAmount':
        comparison = a.profitLossAmount - b.profitLossAmount;
        break;
      case 'margin':
        comparison = a.margin - b.margin;
        break;
      default:
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleDelete = (id: string) => {
    deleteTrade(id)
    toast({
      title: t('trades.tradeDeleted'),
      status: "success",
      duration: 2000,
      isClosable: true,
    })
  }

  const handleViewDetails = (tradeId: string) => {
    setSelectedTradeId(tradeId)
    setIsEditing(false)
    onOpen()
  }

  const handleEditTrade = (tradeId: string) => {
    setSelectedTradeId(tradeId)
    setIsEditing(true)
    onOpen()
  }

  const handleAddNewTrade = () => {
    setSelectedTradeId(null)
    setIsEditing(false)
    onOpen()
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  }

  // Get the selected trade details
  const selectedTrade = selectedTradeId 
    ? trades.find(trade => trade.id === selectedTradeId)
    : null

  const getTradeBadgeColor = (status: Trade['status']) => {
    switch(status) {
      case 'Win': return 'green'
      case 'Loss': return 'red'
      case 'BE': return 'yellow'
      default: return 'gray'
    }
  }

  const getModalTitle = () => {
    if (selectedTradeId) {
      return isEditing ? t('trades.editTrade') : t('trades.tradeDetails')
    }
    return t('addTrade.title')
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex 
        mb={6} 
        gap={4} 
        alignItems="flex-end"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <Text fontSize="sm" mb={1}>{t('trades.search')}</Text>
          <Input
            placeholder={t('trades.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            flexGrow={1}
            width={{ base: 'full', md: '300px' }}
            height="40px"
          />
        </Box>
        
        <Flex 
          gap={4} 
          alignItems="flex-end" 
          width={{ base: 'full', md: 'auto' }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          <Box>
            <Text fontSize="sm" mb={1}>{t('trades.sort')}</Text>
            <Select 
              value={sortField} 
              onChange={(e) => setSortField(e.target.value as SortField)}
              size="md"
              width={{ base: 'full', md: '200px' }}
            >
              <option value="date">{t('trades.sortDate')}</option>
              <option value="profitLossAmount">{t('trades.sortProfitAmount')}</option>
              <option value="profitLossPercentage">{t('trades.sortProfitPercentage')}</option>
              <option value="margin">{t('trades.margin')}</option>
            </Select>
          </Box>
          
          <Box>
            <Text fontSize="sm" mb={1}>{t('trades.sortOrder')}</Text>
            <Button 
              onClick={toggleSortOrder} 
              rightIcon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
              size="md"
              width={{ base: 'full', md: '140px' }}
              height="40px"
            >
              {sortOrder === 'asc' ? t('trades.sortAscending') : t('trades.sortDescending')}
            </Button>
          </Box>
          
          <Box alignSelf="flex-end">
            <Button 
              colorScheme="blue" 
              onClick={handleAddNewTrade} 
              height="40px"
              width={{ base: 'full', md: 'auto' }}
              ml={{ base: 0, md: 2 }}
            >
              {t('trades.addNew')}
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('trades.date')}</Th>
              <Th>{t('trades.pair')}</Th>
              <Th>{t('trades.status')}</Th>
              <Th>{t('trades.margin')}</Th>
              <Th>{t('trades.setup')}</Th>
              <Th>{t('trades.rr')}</Th>
              <Th>{t('trades.pl')}</Th>
              <Th>{t('trades.plAmount')}</Th>
              <Th>{t('trades.actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedTrades.length === 0 ? (
              <Tr>
                <Td colSpan={9} textAlign="center" py={10}>
                  {t('trades.noTradesFound')}
                </Td>
              </Tr>
            ) : (
              sortedTrades.map(trade => (
                <Tr key={trade.id}>
                  <Td>{formatDate(trade.date)}</Td>
                  <Td>{trade.pair}</Td>
                  <Td>
                    <Badge colorScheme={getTradeBadgeColor(trade.status)}>
                      {trade.status}
                    </Badge>
                  </Td>
                  <Td>{formatCurrency(trade.margin)}</Td>
                  <Td>{trade.ictSetup || '-'}</Td>
                  <Td>{trade.expectedRR}R</Td>
                  <Td
                    color={trade.profitLossPercentage > 0 
                      ? 'green.500' 
                      : trade.profitLossPercentage < 0 
                        ? 'red.500' 
                        : 'yellow.500'
                    }
                    fontWeight="bold"
                  >
                    {trade.profitLossPercentage > 0 ? '+' : ''}{trade.profitLossPercentage.toFixed(3)}%
                  </Td>
                  <Td
                    color={trade.profitLossAmount > 0 
                      ? 'green.500' 
                      : trade.profitLossAmount < 0 
                        ? 'red.500' 
                        : 'yellow.500'
                    }
                    fontWeight="bold"
                  >
                    {formatCurrency(trade.profitLossAmount)}
                  </Td>
                  <Td>
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <IconButton
                        aria-label={t('trades.view')}
                        icon={<ViewIcon />}
                        onClick={() => handleViewDetails(trade.id)}
                      />
                      <IconButton
                        aria-label={t('trades.edit')}
                        icon={<EditIcon />}
                        colorScheme="blue"
                        onClick={() => handleEditTrade(trade.id)}
                      />
                      <IconButton
                        aria-label={t('trades.delete')}
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDelete(trade.id)}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
            {getModalTitle()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            {selectedTradeId && selectedTrade && !isEditing ? (
              <Box>
                <Flex mb={5} justify="space-between" align="center">
                  <Text fontSize="xl" fontWeight="bold">{selectedTrade.pair}</Text>
                  <Badge colorScheme={getTradeBadgeColor(selectedTrade.status)} p={2} fontSize="md">
                    {selectedTrade.status}
                  </Badge>
                </Flex>
                
                <Box 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                  p={4}
                  mb={6}
                  bg={boxBg}
                >
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.date')}</Text>
                      <Text fontSize="md">{formatDate(selectedTrade.date)}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.marginDeposit')}</Text>
                      <Text fontSize="md">{formatCurrency(selectedTrade.margin)}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.setup')}</Text>
                      <Text fontSize="md">{selectedTrade.ictSetup || '-'}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.htfTrend')}</Text>
                      <Text fontSize="md">{selectedTrade.htfTrend || '-'}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.expectedRR')}</Text>
                      <Text fontSize="md">{selectedTrade.expectedRR}R</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.profitLoss')}</Text>
                      <Text
                        fontSize="md"
                        color={selectedTrade.profitLossPercentage > 0 
                          ? 'green.500' 
                          : selectedTrade.profitLossPercentage < 0 
                            ? 'red.500' 
                            : 'yellow.500'
                        }
                        fontWeight="bold"
                      >
                        {selectedTrade.profitLossPercentage > 0 ? '+' : ''}{selectedTrade.profitLossPercentage.toFixed(3)}% 
                        ({formatCurrency(selectedTrade.profitLossAmount)})
                      </Text>
                    </Box>
                  </Grid>
                </Box>
                
                <Box 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                  p={4}
                  mb={6}
                  bg={boxBg}
                >
                  <Text fontWeight="bold" mb={3}>Trade Exits</Text>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={3}>
                    <Box>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="semibold" color={textColor} fontSize="sm" mr={2}>{t('tradeDetails.tp1')}</Text>
                        {selectedTrade.tp1.hit ? 
                          <Badge colorScheme="green" fontSize="xs">Hit ✓</Badge> : 
                          <Badge colorScheme="red" fontSize="xs">Not Hit ✗</Badge>
                        }
                      </Flex>
                      <Text fontSize="md">
                        {selectedTrade.tp1.rr}R ({selectedTrade.tp1.percentage}% {t('tradeDetails.position')})
                      </Text>
                    </Box>
                    
                    <Box>
                      <Flex align="center" mb={1}>
                        <Text fontWeight="semibold" color={textColor} fontSize="sm" mr={2}>{t('tradeDetails.tp2')}</Text>
                        {selectedTrade.tp2.hit ? 
                          <Badge colorScheme="green" fontSize="xs">Hit ✓</Badge> : 
                          <Badge colorScheme="red" fontSize="xs">Not Hit ✗</Badge>
                        }
                      </Flex>
                      <Text fontSize="md">
                        {selectedTrade.tp2.rr}R ({selectedTrade.tp2.percentage}% {t('tradeDetails.position')})
                      </Text>
                    </Box>
                  </Grid>
                  
                  <Box>
                    <Flex align="center" mb={1}>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm" mr={2}>{t('tradeDetails.sl')}</Text>
                      {selectedTrade.sl.hit ? 
                        <Badge colorScheme="red" fontSize="xs">Hit ✗</Badge> : 
                        <Badge colorScheme="green" fontSize="xs">Not Hit ✓</Badge>
                      }
                    </Flex>
                    <Text fontSize="md">
                      {selectedTrade.sl.percentage}% {t('tradeDetails.accountRisk')}
                    </Text>
                  </Box>
                </Box>
                
                <Box mb={6}>
                  <Text fontWeight="bold" mb={3}>Notes</Text>
                  <Box 
                    borderRadius="md" 
                    borderWidth="1px" 
                    borderColor={borderColor}
                    p={4}
                    bg={boxBg}
                  >
                    <Box mb={4}>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.psychology')}</Text>
                      <Text fontSize="md">{selectedTrade.psychology}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">{t('tradeDetails.notes')}</Text>
                      <Text whiteSpace="pre-wrap" fontSize="md">{selectedTrade.notes || '-'}</Text>
                    </Box>
                  </Box>
                </Box>
                
                {selectedTrade.image && (
                  <Box mb={6}>
                    <Text fontWeight="bold" mb={3}>Chart Image</Text>
                    <Box 
                      borderRadius="md" 
                      borderWidth="1px" 
                      borderColor={borderColor}
                      p={4}
                      bg={boxBg}
                    >
                      <Image
                        src={selectedTrade.image}
                        alt="Trade chart"
                        maxH="350px"
                        objectFit="contain"
                        mx="auto"
                      />
                    </Box>
                  </Box>
                )}
                
                <HStack spacing={4} mt={8} justify="flex-end">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    {t('trades.edit')}
                  </Button>
                  <Button variant="solid" onClick={onClose}>{t('trades.close')}</Button>
                </HStack>
              </Box>
            ) : (
              <AddTradeForm onClose={onClose} existingTrade={isEditing && selectedTrade ? selectedTrade : undefined} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}