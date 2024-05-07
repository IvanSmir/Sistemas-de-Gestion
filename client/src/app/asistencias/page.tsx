import { List } from '@/components/asistencias/List';
import React from 'react'
import '../../app/globals.css'
import Link from 'next/link';
const index = () => {
    return (

        <div>
            <div className="flex justify-between items-center">
                <Link href={'/asistencias/add'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Crear Asistencia</button></Link>
            </div>
            <List />
        </div>
    )
}
export default index;