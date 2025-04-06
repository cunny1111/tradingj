'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Checkbox,
  FormHelperText,
  useToast,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image' // Thêm import này
import { useStore, TradeStatus, Psychology, Trade } from '@/lib/store'
import { fileToBase64 } from '@/lib/utils'
import { useLanguage } from '@/lib/languageContext'

interface AddTradeFormProps {
  onClose: () => void
  existingTrade?: Trade
}

export default function AddTradeForm({ onClose, existingTrade }: AddTradeFormProps) {
  const { t } = useLanguage()
  const toast = useToast()
  const { addTrade, updateTrade, initialAccount } = useStore()
  const isEditing = !!existingTrade
  
  // Form state
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [pair, setPair] = useState<string>('')
  const [htfTrend, setHtfTrend] = useState<string>('')
  const [ictSetup, setIctSetup] = useState<string>('')
  const [margin, setMargin] = useState<number>(1000000) // 1 million VND default
  const [expectedRR, setExpectedRR] = useState<number>(2)
  
  const [tp1RR, setTp1RR] = useState<number>(1)
  const [tp1Percentage, setTp1Percentage] = useState<number>(50)
  const [tp1Hit, setTp1Hit] = useState<boolean>(false)
  
  const [tp2RR, setTp2RR] = useState<number>(2)
  const [tp2Percentage, setTp2Percentage] = useState<number>(50)
  const [tp2Hit, setTp2Hit] = useState<boolean>(false)
  
  const [slPercentage, setSlPercentage] = useState<number>(1)
  const [slHit, setSlHit] = useState<boolean>(false)
  
  const [profitLossPercentage, setProfitLossPercentage] = useState<number>(0)
  const [profitLossAmount, setProfitLossAmount] = useState<number>(0)
  const [status, setStatus] = useState<TradeStatus>('Win')
  const [psychology, setPsychology] = useState<Psychology>('Confident')
  const [notes, setNotes] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  
  // Initialize form with existing trade data when editing
  useEffect(() => {
    if (existingTrade) {
      setDate(existingTrade.date)
      setPair(existingTrade.pair)
      setHtfTrend(existingTrade.htfTrend)
      setIctSetup(existingTrade.ictSetup)
      setMargin(existingTrade.margin)
      setExpectedRR(existingTrade.expectedRR)
      
      setTp1RR(existingTrade.tp1.rr)
      setTp1Percentage(existingTrade.tp1.percentage)
      setTp1Hit(existingTrade.tp1.hit)
      
      setTp2RR(existingTrade.tp2.rr)
      setTp2Percentage(existingTrade.tp2.percentage)
      setTp2Hit(existingTrade.tp2.hit)
      
      setSlPercentage(existingTrade.sl.percentage)
      setSlHit(existingTrade.sl.hit)
      
      setProfitLossPercentage(existingTrade.profitLossPercentage)
      setProfitLossAmount(existingTrade.profitLossAmount || 0)
      setStatus(existingTrade.status)
      setPsychology(existingTrade.psychology)
      setNotes(existingTrade.notes)
      setImage(existingTrade.image)
    }
  }, [existingTrade])
  
  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const base64 = await fileToBase64(file)
      setImage(base64)
    } catch (error) {
      console.error('Error converting image to base64:', error)
      toast({
        title: 'Error uploading image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }
  
  // Calculate P/L based on TP/SL hits
  const calculatePL = () => {
    let actualPLPercentage = 0;
    
    if (slHit) {
      actualPLPercentage = -slPercentage;
    } else {
      if (tp1Hit) {
        actualPLPercentage += tp1RR * slPercentage * (tp1Percentage / 100);
      }
      
      if (tp2Hit) {
        actualPLPercentage += tp2RR * slPercentage * (tp2Percentage / 100);
      }
    }
    
    const plAmount = (margin * actualPLPercentage) / 100;
    const plPercentage = (plAmount / initialAccount) * 100;
    
    setProfitLossPercentage(plPercentage);
    setProfitLossAmount(plAmount);
    
    if (plAmount > 0) {
      setStatus('Win');
    } else if (plAmount < 0) {
      setStatus('Loss');
    } else {
      setStatus('BE');
    }
  }
  
  // Handle form submission
  const handleSubmit = () => {
    if (!pair) {
      toast({
        title: t('addTrade.missingInfo'),
        description: t('addTrade.enterPair'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    
    const tradeData = {
      date,
      pair,
      htfTrend,
      ictSetup,
      margin,
      expectedRR,
      tp1: {
        rr: tp1RR,
        percentage: tp1Percentage,
        hit: tp1Hit,
      },
      tp2: {
        rr: tp2RR,
        percentage: tp2Percentage,
        hit: tp2Hit,
      },
      sl: {
        percentage: slPercentage,
        hit: slHit,
      },
      profitLossPercentage,
      profitLossAmount,
      status,
      psychology,
      notes,
      image,
    }
    
    if (isEditing && existingTrade) {
      updateTrade(existingTrade.id, tradeData)
      toast({
        title: t('trades.tradeUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      addTrade(tradeData)
      toast({
        title: t('addTrade.tradeAdded'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    
    onClose()
  }
  
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>{t('addTrade.date')}</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl isRequired>
              <FormLabel>{t('addTrade.pair')}</FormLabel>
              <Input
                placeholder={t('addTrade.pairPlaceholder')}
                value={pair}
                onChange={(e) => setPair(e.target.value)}
              />
            </FormControl>
          </GridItem>
        </Grid>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel>{t('addTrade.htfTrend')}</FormLabel>
              <Select
                value={htfTrend}
                onChange={(e) => setHtfTrend(e.target.value)}
              >
                <option value="">{t('addTrade.selectTrend')}</option>
                <option value="Bullish">{t('addTrade.bullish')}</option>
                <option value="Bearish">{t('addTrade.bearish')}</option>
                <option value="Ranging">{t('addTrade.ranging')}</option>
                <option value="Unclear">{t('addTrade.unclear')}</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>{t('addTrade.ictSetup')}</FormLabel>
              <Input
                placeholder={t('addTrade.ictSetupPlaceholder')}
                value={ictSetup}
                onChange={(e) => setIctSetup(e.target.value)}
              />
            </FormControl>
          </GridItem>
        </Grid>
        
        <FormControl>
          <FormLabel>{t('addTrade.marginAmount')}</FormLabel>
          <NumberInput
            min={1000}
            step={1000000}
            value={margin}
            onChange={(valueString) => setMargin(parseFloat(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>{t('addTrade.marginHelp')}</FormHelperText>
        </FormControl>
        
        <FormControl>
          <FormLabel>{t('addTrade.expectedRR')}</FormLabel>
          <NumberInput
            min={0.1}
            step={0.1}
            value={expectedRR}
            onChange={(valueString) => setExpectedRR(parseFloat(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold" mb={2}>{t('addTrade.tp1')}</Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>{t('addTrade.tp1RR')}</FormLabel>
                <NumberInput
                  min={0.1}
                  step={0.1}
                  value={tp1RR}
                  onChange={(valueString) => setTp1RR(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>{t('addTrade.tp1Percentage')}</FormLabel>
                <NumberInput
                  min={1}
                  max={100}
                  value={tp1Percentage}
                  onChange={(valueString) => setTp1Percentage(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>{t('addTrade.tp1PercentageHelp')}</FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>
          
          <Checkbox
            mt={2}
            isChecked={tp1Hit}
            onChange={(e) => {
              setTp1Hit(e.target.checked)
              setTimeout(calculatePL, 0)
            }}
          >
            {t('addTrade.tp1Hit')}
          </Checkbox>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold" mb={2}>{t('addTrade.tp2')}</Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>{t('addTrade.tp2RR')}</FormLabel>
                <NumberInput
                  min={0.1}
                  step={0.1}
                  value={tp2RR}
                  onChange={(valueString) => setTp2RR(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>{t('addTrade.tp2Percentage')}</FormLabel>
                <NumberInput
                  min={1}
                  max={100}
                  value={tp2Percentage}
                  onChange={(valueString) => setTp2Percentage(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>{t('addTrade.tp2PercentageHelp')}</FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>
          
          <Checkbox
            mt={2}
            isChecked={tp2Hit}
            onChange={(e) => {
              setTp2Hit(e.target.checked)
              setTimeout(calculatePL, 0)
            }}
          >
            {t('addTrade.tp2Hit')}
          </Checkbox>
        </Box>
        
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text fontWeight="bold" mb={2}>{t('addTrade.sl')}</Text>
          
          <FormControl>
            <FormLabel>{t('addTrade.slPercentage')}</FormLabel>
            <NumberInput
              min={0.1}
              step={0.1}
              value={slPercentage}
              onChange={(valueString) => setSlPercentage(parseFloat(valueString))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>{t('addTrade.slPercentageHelp')}</FormHelperText>
          </FormControl>
          
          <Checkbox
            mt={2}
            isChecked={slHit}
            onChange={(e) => {
              setSlHit(e.target.checked)
              if (e.target.checked) {
                setTp1Hit(false)
                setTp2Hit(false)
              }
              setTimeout(calculatePL, 0)
            }}
          >
            {t('addTrade.slHit')}
          </Checkbox>
        </Box>
        
        <FormControl>
          <FormLabel>{t('addTrade.plPercentage')}</FormLabel>
          <NumberInput
            value={profitLossPercentage.toFixed(3)}
            onChange={(valueString) => {
              setProfitLossPercentage(parseFloat(valueString));
              setProfitLossAmount((parseFloat(valueString) * initialAccount) / 100);
            }}
          >
            <NumberInputField />
          </NumberInput>
          <FormHelperText>{t('addTrade.plPercentageHelp')}</FormHelperText>
        </FormControl>
        
        <FormControl>
          <FormLabel>{t('addTrade.plAmount')}</FormLabel>
          <NumberInput
            value={profitLossAmount.toFixed(0)}
            onChange={(valueString) => {
              const amount = parseFloat(valueString);
              setProfitLossAmount(amount);
              setProfitLossPercentage((amount / initialAccount) * 100);
            }}
          >
            <NumberInputField />
          </NumberInput>
          <FormHelperText>{t('addTrade.plAmountHelp')}</FormHelperText>
        </FormControl>
        
        <Button size="sm" mt={1} onClick={calculatePL}>
          {t('addTrade.calculate')}
        </Button>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel>{t('addTrade.tradeStatus')}</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TradeStatus)}
              >
                <option value="Win">{t('addTrade.win')}</option>
                <option value="Loss">{t('addTrade.loss')}</option>
                <option value="BE">{t('addTrade.be')}</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>{t('addTrade.psychology')}</FormLabel>
              <Select
                value={psychology}
                onChange={(e) => setPsychology(e.target.value as Psychology)}
              >
                <option value="FOMO">{t('addTrade.fomo')}</option>
                <option value="Confident">{t('addTrade.confident')}</option>
                <option value="Worried">{t('addTrade.worried')}</option>
                <option value="Neutral">{t('addTrade.neutral')}</option>
                <option value="Impatient">{t('addTrade.impatient')}</option>
                <option value="Disciplined">{t('addTrade.disciplined')}</option>
              </Select>
            </FormControl>
          </GridItem>
        </Grid>
        
        <FormControl>
          <FormLabel>{t('addTrade.notes')}</FormLabel>
          <Textarea
            placeholder={t('addTrade.notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>{t('addTrade.chartImage')}</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </FormControl>
        
        {image && (
          <Box mt={2}>
            <Text fontSize="sm" mb={1}>{t('addTrade.preview')}</Text>
            <Image
              src={image}
              alt="Chart preview"
              width={300} // Điều chỉnh dựa trên kích thước thực tế
              height={150}
              objectFit="contain"
            />
          </Box>
        )}
        
        <HStack spacing={4} mt={4}>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {isEditing ? t('trades.saveChanges') : t('addTrade.saveTrade')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('addTrade.cancel')}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}