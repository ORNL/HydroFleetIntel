import { Box, ChakraProvider, CSSReset, Heading } from '@chakra-ui/react'
import { customTheme } from '../components/customTheme'
import dynamic from 'next/dynamic'

const Taxonomy = dynamic(
  () => import('../components/Taxonomy').then((a) => a.Taxonomy),
  {
    ssr: false
  }
)

export default function Home() {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Box h="3em" background="#dbdbdb" border="1px solid black">
        <Heading ml="1em" as="h3">
          Hydropower Fleet Intelligence Data Viewer
        </Heading>
      </Box>
      <main>
        <Taxonomy />
      </main>
    </ChakraProvider>
  )
}
