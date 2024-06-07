'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Select, Button, Input, Heading } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from '../lists/Pagination';
import Link from 'next/link';


type TableEmployeeProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    setEmployeeData?: any;
    total: number;
}

export const ListEmployee: React.FC<TableEmployeeProps> = ({ data, columnMapping, setEmployeeData, total }) => {
    // Obtener los encabezados desde las claves de columnMapping
    const headers = Object.keys(columnMapping);
    console.log(data);
    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Egresos</Heading>

            <Box backgroundColor={'white'} top={160} left={300} width={"100%"} height={426} borderRadius="2xl" padding="8px" mt={10} >
                <TableContainer>
                    <Table variant="simple" fontSize={{ base: "12px", sm: "13px", md: "14px", lg: "15px", xl: "16px", "2xl": "17px" }}>
                        <Thead>
                            <Tr>
                                {headers.map((header, index) => (
                                    <Th key={index} textAlign="center" verticalAlign="middle">
                                        {header}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((datum) => (
                                <Tr key={datum.id}>
                                    {headers.map((header) => (
                                        <Td key={`${datum.id}-${header}`} textAlign="center" verticalAlign="middle">
                                            {datum.person[columnMapping[header]]}
                                        </Td>
                                    ))}
                                    <Td>
                                        <Link className='text-blue-500' href={`/transaction/expenses/${datum.id}`}>
                                            Egresos
                                        </Link>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Pagination setEmployeedata={setEmployeeData} total={total} />


        </Flex >
    );
}