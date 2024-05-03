import { BtnDelete } from '@/components/funcionarios/BtnDelete'
import { BtnEdit } from '@/components/funcionarios/BtnEdit'
import axios from 'axios'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'

const ListaCargo = () => {

    const [cargos, setCargos] = useState([])
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await axios.get('http://localhost:3002/cargos')
                setCargos(response.data)
            }
            fetchData()
            console.log(cargos)
        } catch (error) {
            console.log(error)
        }
    }, [])


    // const cargos = [
    //     {
    //         _id: 1,
    //         nombre: "un nombre",
    //         descripcion: "un cargo con un nombre",
    //         vacantes: 1

    //     },
    //     {
    //         _id: 2,
    //         nombre: "dos nombres",
    //         descripcion: "un cargo con dos nombres",
    //         vacantes: 2

    //     },
    //     {
    //         _id: 3,
    //         nombre: "tres nombres",
    //         descripcion: "un cargo con tres nombres",
    //         vacantes: 3

    //     }
    // ]

    return <div>
        <h1 className='flex flex-col p-10'>Lista de Cargos</h1>
        <Link href={'/generales/cargos/add'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Crear Cargo</button></Link>
        <table className='table-auto w-full'>
            <thead>
                <tr>
                    <th className='px-4 py-2'>Nombre</th>
                    <th className='px-4 py-2'>Descripcion</th>
                    <th className='px-4 py-2'>Vacantes</th>
                    <th className='px-4 py-2'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    cargos.map((cargo: any) => (
                        <tr key={cargo.id}>
                            <td className='border px-4 py-2'>{cargo.name}</td>
                            <td className='border px-4 py-2'>{cargo.description}</td>
                            <td className='border px-4 py-2'>{cargo.vacancies}</td>
                            <td className='border px-4 py-2'><button>edit</button><button>delete</button></td>
                        </tr>)
                    )
                }
            </tbody>
        </table>
    </div>
}
export default ListaCargo