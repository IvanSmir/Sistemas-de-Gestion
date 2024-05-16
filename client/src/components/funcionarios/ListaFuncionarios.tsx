'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { DetalleFuncionario } from './DetalleFuncionario';

import {
    Table,
    Tbody,
    Tr,
    Td,
    TableCaption,
    TableContainer,
    Container,
    Button,
    Box,
    useDisclosure,
    Th
  } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Pagination from './Pagination';
export const ListaFuncionarios = () => {
    // const funcionarios = [
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',


    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },]

    const [funcionarios, setFuncionarios] = useState([]);
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await axios.get('http://localhost:3002/employees')
                setFuncionarios(response.data)
            }
            fetchData()
            console.log(funcionarios)
        } catch (error) {
            console.log(error)
        }
    }, [])
     
    return (
        
            <Box className="absolute h-auto min-h-[80vh] max-h-[80vh]  bg-white w-[70%] p-5">        
                <Box className="flex justify-between">
                    <Box className="flex items-center gap-2">
                        <Button rounded={23} fontSize={14} ml={3} py={1} px={5} background='white' variant='outline' rightIcon={<ChevronDownIcon />} gap={2} color='white'>
                            <span className="text-[#888888]">botonAlgo</span>
                        </Button>
                        <Button rounded={23} fontSize={14} py={1} px={5} background='white' variant='outline' rightIcon={<ChevronDownIcon />} gap={2} color='white'  >
                            <span className="text-[#888888]">Ordenar Por:</span>
                            <span className="font-semibold ">{"Algo"}</span>
                        </Button>
                    </Box>
                    <Link href={'/funcionarios/details'}>
                    <Button  rounded={23} mr={5} fontSize={13} py={3} px={5} background='#AA546D' gap={2} color='white'   > Detalle Funcionario </Button>
                    </Link> 
                    <Link href={'/funcionarios/add'}>
                        <Button rounded={23} mr={5} fontSize={13} py={3} px={5} background='#AA546D' gap={2} color='white'   ><AddIcon />Agregar Funcionario </Button>
                    </Link>
                </Box>
       
                <TableContainer className='table-auto w-full'>
                    <Table variant='simple'>
                        <Tr>
                            <Th className='px-4 py-2'>Ruc</Th>
                            <Th className='px-4 py-2'>Nombre</Th>
                            <Th className='px-4 py-2'>Email</Th>
                            <Th className='px-4 py-2'>Numero de telefono</Th>
                            <Th className='px-4 py-2'>Direccion</Th>
                            <Th className='px-4 py-2'>Acciones</Th>
                        </Tr>
                   
                    <Tbody>
                        {funcionarios.map((funcionario: any) => {
                            return (
                                <Tr key={funcionario.id}>
                                    <Td className='border px-4 py-2'>{funcionario.ruc}</Td>
                                    <Td className='border px-4 py-2'>{funcionario.name}</Td>
                                    <Td className='border px-4 py-2'>{funcionario.email}</Td>
                                    <Td className='border px-4 py-2'>{funcionario.phone}</Td>
                                    <Td className='border px-4 py-2'>{funcionario.direction}</Td>
                                    <Td>
                                    <EditIcon mr={2} cursor="pointer" />
                                    <DeleteIcon cursor="pointer" />
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                    </Table>
                    <Pagination/>
                </TableContainer>    
            </Box>
        
    );
};
