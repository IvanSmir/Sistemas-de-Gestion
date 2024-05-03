import { List } from '@/components/asistencias/List';
import React from 'react'
import '../../app/globals.css'
import Layout from '../../app/layout'
import Link from 'next/link';
const index = () => {
    return (
        <Layout>

            <div>
                <div className="flex justify-between items-center">
                    <Link href={'/asistencias/add'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Crear Asistencia</button></Link>

                </div>

                <List />
            </div>
        </Layout>
    )
}
export default index;