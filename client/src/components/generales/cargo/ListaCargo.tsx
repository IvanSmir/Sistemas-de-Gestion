
import React from 'react'
import {  IconButton} from '@chakra-ui/react'
import { DeleteIcon, EditIcon} from '@chakra-ui/icons'
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

 export const ListaCargo = () => {

    const cargos = [
        {
            _id: 1,
            
            nombre: "un nombre",
            cargo: "Gerente General",
            lugar: "Casa Matriz",

        },
        {
            _id: 2,
            
            nombre: "dos nombres",
            cargo: "Empleado",
            lugar: "Sucursal",

        },
        {
            _id: 3,
            
            nombre: "tres nombres",
            cargo: "Cajero",
            lugar: "Casa Matriz",

        }, 
        {
            _id: 4,
            
            nombre: "tres nombres",
            cargo: "Empleado",
            lugar: "Casa Matriz",

        }
    ]

    return(
        <TableContainer>
        <h1 className='flex flex-col p-10'>Cargos</h1>
        <Table className='table-auto w-full' variant='simple' colorScheme='teal'>
            
            <Thead>
                <Tr>
                    
                    <Th className='px-4 py-2'>Nombre</Th>
                    <Th className='px-4 py-2'>Cargo</Th>
                    <Th className='px-4 py-2'>Lugar</Th>
                    <Th className='px-4 py-2'>Acciones</Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    cargos.map(cargo => (
                        <Tr key={cargo._id}>
                        
                            <Td className='border px-4 py-2'>{cargo.nombre}</Td>
                            <Td className='border px-4 py-2'>{cargo.cargo}</Td>
                            <Td className='border px-4 py-2'>{cargo.lugar}</Td>
                            <Td className='border px-4 py-2'> 
                            <IconButton aria-label='Editar'colorScheme='teal' m={2} icon={<EditIcon />} /> 
                            <IconButton aria-label='borrar'colorScheme='red' m={2} icon={<DeleteIcon />} />   
                          
                            
                             </Td>
                        </Tr>)
                    )
                }
            </Tbody>
        </Table>
        </TableContainer>
    


);    
};



