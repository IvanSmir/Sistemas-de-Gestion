'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Select, Button, Input } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from './Pagination'
import Link from 'next/link';

// Definimos los tipos para las props
type TableEmployeeProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    setEmployeeData?: any;
    total: number;
}

export const TableEmployee: React.FC<TableEmployeeProps> = ({ data, columnMapping, setEmployeeData, total }) => {
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
        <>
            <Box >
                <Box backgroundColor={'white'} top={160} left={300} width={900} height={426} borderRadius="2xl" padding="8px" margin="auto">
                    <Flex justifyContent="space-between" mb={6}>
                        <Flex gap={2}>
                            <Input
                                placeholder="Número de cédula"
                                value={filters.ci}
                                onChange={handleCiFilter}
                                rounded={15}
                                background='white'
                                color='gray.600'
                                _hover={{ bg: "gray.100" }}
                            />
                            <Select
                                onChange={handleAgeRangeFilter}
                                value={filters.ageRange}
                                rounded={15}
                                background='white'
                                color='gray.600'
                                _hover={{ bg: "gray.100" }}
                            >
                                <option value="">Todos</option>
                                <option value="menores18">Menores de Edad</option>
                                <option value="mayores18">Mayores de Edad</option>
                            </Select>
                        </Flex>
                        <Link href={'/employees/add'}><Button rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'>
                            Agregar Funcionario
                        </Button></Link>
                    </Flex>
                    <TableContainer >
                        <Table variant="simple" fontSize="14px">
                            <Thead>
                                <Tr>
                                    {headers.map((header, index) => <Th key={index} textAlign="center" verticalAlign="middle">{header}</Th>)}
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
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>

                </Box>
                <Pagination setEmployeedata={setEmployeeData} total={total} />
            </Box>
        </>
    )
}
