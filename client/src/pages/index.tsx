import React from 'react'
import Layout from '../app/layout'
import {Flex} from '@chakra-ui/react'
import { SiberBar } from '@/components/ui/NavBar/SiberBar'

const index = () => {
  return (
   <Layout>
      <Flex>
        <SiberBar/>
      </Flex>
   </Layout>
  )
}
export default index;