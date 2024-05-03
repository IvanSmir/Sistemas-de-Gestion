import React from 'react'
import Layout from '../../../../app/layout'
import { Form } from '@/components/generales/cargos/Form';
import ListaCargo from '@/components/generales/cargos/ListaCargo';

const index = () => {
    return (
        <Layout>
            <h1 className=" text-6xl">Cargos</h1>
            <Form></Form>

        </Layout>
    )
}
export default index;