'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Select, Button, Input } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from '../lists/Pagination';
import Link from 'next/link';

// Definimos los tipos para las props
type TableEmployeeProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    setEmployeeData?: any;
    total: number;
}

export const List: React.FC<TableEmployeeProps> = ({ data, columnMapping, setEmployeeData, total }) => {
    // Obtener los encabezados desde las claves de columnMapping

    const headers = Object.keys(columnMapping);
    console.log(data);
    const [filters, setFilters] = useState<{ ci: string; ageRange: string }>({
        ci: '',
        ageRange: '',
    });
    const handleCiFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ci: e.target.value });
    };

    const handleAgeRangeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, ageRange: e.target.value });
    };

    return (
        <Box marginTop={6} width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} >
            <Box backgroundColor="white" borderRadius="2xl" padding="8px">
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
                                        <Link className='text-blue-500' href={`/transaction/incomes/${datum.id}`}>
                                            Ingresos
                                        </Link>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Pagination setEmployeedata={setEmployeeData} total={total} />
        </Box>
    );
}