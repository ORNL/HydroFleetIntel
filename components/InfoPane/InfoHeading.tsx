import { Box, Heading } from '@chakra-ui/react'
import { FC } from 'react'

type propTypes = {
  text: string
}

export const InfoHeading: FC<propTypes> = (props) => {
  const { text } = props

  return (
    <Heading
      fontWeight={'600'}
      size="md"
      as="h3"
      textDecor={'underline'}
      textAlign="center"
    >
      {text}
    </Heading>
  )
}
