import { FC } from 'react'
import {Flex, Text} from '@chakra-ui/react'

type propTypes = {
  dataType: string
  fontSize: string,
  color: string,
  paddingTop?: string,
  flexGrow?: number,
  alignSelf?: string,
  justifyContent?: string
}
  
  export const NoData: FC<propTypes> = (props) => {
    const {dataType, fontSize, color, paddingTop, flexGrow, alignSelf, justifyContent } = props

    {/* <Text fontSize={'4xl'} color='red' paddingTop='20px' textAlign='center'>No data available.</Text> */}
    return (
      
      <Text 
        as={Flex} 
        flexGrow={flexGrow ? flexGrow : 0}
        alignSelf={alignSelf ? alignSelf : 'auto'}
        justifyContent={justifyContent ? justifyContent : 'initial'}
        fontSize={fontSize} 
        color={color} 
        paddingTop={paddingTop ? paddingTop : '0'} 
        textAlign={'center'}>
          No {dataType} data found for this facility. Please load data to use this feature.
      </Text>
    )
  }