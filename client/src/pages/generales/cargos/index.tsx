import React from 'react'
import { ListaCargo } from '@/components/generales/cargo/ListaCargo'
import Layout from '../../../app/layout'
import { ChakraProvider } from '@chakra-ui/react'

const  index =() =>{
   
    return(
        
        <Layout>
            <ListaCargo/>
        </Layout>
        
    )

}

export default index;