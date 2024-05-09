'use client'
import axios from 'axios'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

const ListaCargo = () => {

    const [cargos, setCargos] = useState([
        {
            _id: 1,
            nombre: "Gerente General",
            lugar: "Casa Matriz",
        }
    ])
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

    return (
        <div>
            <h1 className='flex flex-col p-10'>Lista de Cargos</h1>
            <Link href={'/generales/cargos/add'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Crear Cargo</button></Link>
            <TableContainer>
                <h1 className='flex flex-col p-10'>Cargos</h1>
                <Table className='table-auto w-full' variant='simple' colorScheme='teal'>

                    <Thead>
                        <Tr>

                            <Th className='px-4 py-2'>Nombre</Th>
                            <Th className='px-4 py-2'>Lugar</Th>
                            <Th className='px-4 py-2'>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            cargos.map(cargo => (
                                <Tr key={cargo._id}>

                                    <Td className='border px-4 py-2'>{cargo.nombre}</Td>
                                    <Td className='border px-4 py-2'>{cargo.lugar}</Td>
                                    <Td className='border px-4 py-2'>
                                        <IconButton aria-label='Editar' colorScheme='teal' m={2} icon={<EditIcon />} />
                                        <IconButton aria-label='borrar' colorScheme='red' m={2} icon={<DeleteIcon />} />


                                    </Td>
                                </Tr>)
                            )
                        }
                    </Tbody>
                </Table>
            </TableContainer>


        </div>
    );
};
export default ListaCargo