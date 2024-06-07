'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from '../../lists/Pagination';
import Link from 'next/link';
import VerifiedModal from './VerifiedModal';
import Period from "@/types/period";
// Definimos los tipos para las props
type PaymentsProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    payments: Period[];
}

export const TableEmployee: React.FC<PaymentsProps> = ({ data, columnMapping, payments }) => {
    const headers = Object.keys(columnMapping);


    return (
        <Box marginTop={6} width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} >
            <TableContainer>
                <Table variant="simple" fontSize={{ base: "12px", sm: "13px", md: "14px", lg: "15px", xl: "16px", "2xl": "17px" }}>
                    <Thead >
                        <Tr>
                            <Th>

                            </Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {payments.map((datum) => (
                            <Tr key={datum.id}>
                                {headers.map((header) => (
                                    <Td key={`${datum.id}-${header}`} textAlign="center" verticalAlign="middle">{datum[columnMapping[header]]}</Td>
                                ))}
                                <Td>
                                    <Link className='text-blue-500' href={`/employees/${datum.employeeId}`}>
                                        Detalles
                                    </Link>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box >
    );
}
