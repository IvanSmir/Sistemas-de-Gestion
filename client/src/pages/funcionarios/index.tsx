import { Form } from '@/components/funcionarios/Form';
import React from 'react'
import '../../app/globals.css'
import Layout from '../../app/layout'
import { Lista } from '@/components/funcionarios/Lista';
const index = () => {
  return (
    <Layout>


    <Lista/>
    </Layout>
  )
}
export default index;