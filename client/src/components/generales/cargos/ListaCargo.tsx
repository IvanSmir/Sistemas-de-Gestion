'use client'
import axios from 'axios'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { Input, IconButton, InputGroup, InputLeftElement, Button, Box, Flex} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, } from '@chakra-ui/react'
import Pagination from './Pagination'

const ListaCargo = () => {

    const [cargos, setCargos] = useState([
        {
            _id: 1,
            nombre: "Aaaaa Bbbbb",
            descripcion: "Gerente General",
            sueldoBase: 1500000,
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



    return (
        <div className="bg-[#F3F3F3] h-full relative">
            <div className="absolute h-auto min-h-[80vh] max-h-[80vh] rounded-xl bg-white w-[90%] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

                <div className="flex justify-between">
                    <div className="flex items-center gap-2">

                        <Button rounded={23} fontSize={14} ml={8} py={3} px={6} h={9} background='white' variant='outline' rightIcon={<ChevronDownIcon />} gap={3} color='white'>
                            <span className="text-[#888888]">botonAlgo</span>
                        </Button>
                        <Button rounded={23} fontSize={14} py={3} px={6} h={9} background='white' variant='outline' rightIcon={<ChevronDownIcon />} gap={3} color='white'  >
                            <span className="text-[#888888]">Ordenar Por:</span>
                            <span className="font-semibold ">{"Algo"}</span>
                        </Button>
                    </div>
                    <Button rounded={23} mr={10} fontSize={13} py={3} px={6} h={9}  background='#AA546D' gap={2} color='white'   ><AddIcon />Agregar Cargo </Button>
                </div>

                <Box className="border-[#e4b1bc] " top={160} left={300} width={880}  height={330} borderRadius="2xl" padding="8px" margin="auto"> 
                
                <TableContainer>

                    <Table className='table-auto w-full mt-2 pt-3  '  variant='simple'>

                        <Thead  >
                            <Tr>
                                <Td fontSize={14} className='px-4 py-2'>Nombre</Td>
                                <Td fontSize={14} className='px-4 py-2'>Descripción</Td>
                                <Td fontSize={14} className='px-4 py-2'>Sueldo Base</Td>
                                <Td fontSize={14} className='px-4 py-2'>Acciones</Td>
                            </Tr>
                        </Thead>
                        <Tbody >
                            {
                                cargos.map(cargo => (
                                    <Tr key={cargo._id}>

                                        <Td fontSize={13} className='py-1'>{cargo.nombre}</Td>
                                        <Td fontSize={13} className='py-1'>{cargo.descripcion}</Td>
                                        <Td fontSize={13} className='py-1'>{cargo.sueldoBase}</Td>
                                        <Td fontSize={13} className='flex gap-1 px-4 py-1'>
                                            <IconButton aria-label='Editar' colorScheme='white' icon={<EditIcon />} color='#D8D9DB' />
                                            <IconButton aria-label='borrar' colorScheme='white' icon={<DeleteIcon />} color='red' />


                                        </Td>
                                    </Tr>)
                                )
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                </Box>
                <Pagination />
            </div>
        </div>
    );
};
export default ListaCargo