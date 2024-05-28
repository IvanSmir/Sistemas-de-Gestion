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
        <Box width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} >
            <Box backgroundColor="white" borderRadius="2xl" padding="8px">
                <Flex justifyContent="space-between" mb={6} flexWrap="wrap">
                    <Flex gap={2} flexWrap="wrap">
                        <Input
                            placeholder="Número de cédula"
                            value={filters.ci}
                            onChange={handleCiFilter}
                            rounded={15}
                            background="white"
                            color="gray.600"
                            _hover={{ bg: "gray.100" }}
                            flex="1"
                            minWidth={{ base: "200px", sm: "220px", md: "240px", lg: "260px", xl: "280px", "2xl": "300px" }}
                        />
                        <Select
                            onChange={handleAgeRangeFilter}
                            value={filters.ageRange}
                            rounded={15}
                            background="white"
                            color="gray.600"
                            _hover={{ bg: "gray.100" }}
                            flex="1"
                            minWidth={{ base: "200px", sm: "220px", md: "240px", lg: "260px", xl: "280px", "2xl": "300px" }}
                        >
                            <option value="">Todos</option>
                            <option value="menores18">Menores de Edad</option>
                            <option value="mayores18">Mayores de Edad</option>
                        </Select>
                    </Flex>
                    <Link href="/employees/add">
                        <Button
                            rounded={23}
                            mr={5}
                            fontSize={{ base: 11, sm: 12, md: 13, lg: 14, xl: 15, "2xl": 16 }}
                            py={{ base: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, "2xl": 4.5 }}
                            px={{ base: 4, sm: 4.5, md: 5, lg: 5.5, xl: 6, "2xl": 6.5 }}
                            bgColor="#AA546D"
                            _hover={{ bgColor: "#c1738e" }}
                            gap={2}
                            color="white"
                            mt={{ base: "10px", md: "0" }}
                        >
                            Agregar Funcionario
                        </Button>
                    </Link>
                </Flex>
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
                                        <Link href={`/employees/${datum.id}`}>
                                            detalles
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
