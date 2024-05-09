import React from 'react'
import { Sueldo } from '@/components/generales/sueldo/Sueldo'
import Layout from '../../../app/layout'
import { ChakraProvider } from '@chakra-ui/react'

const  index =() =>{
   
    return(
        
        <Layout>
            <Sueldo/>
        </Layout>
        
    )

}

export default index;