'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Select, Button, Input, Heading, FormControl, FormLabel } from '@chakra-ui/react';
import React, { ChangeEvent, useState, useEffect } from 'react'
import Pagination from '../lists/Pagination';
import Link from 'next/link';
import { getEmployeeByTerm } from '@/utils/employee.http';
import { useAuth } from "../context/AuthProvider";

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
    const auth = useAuth();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [isSearching, setIsSearching] = useState(false);
    
    const handleTermFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (term.length >= 3) {
            setIsSearching(true);
            const localFiltered = data.filter((datum) => {
                return Object.keys(columnMapping).some((key) => {
                    const value = datum.person[columnMapping[key]]?.toString().toLowerCase();
                    return value && value.includes(term.toLowerCase());
                });
            });
            setFilteredData(localFiltered);
        } else {
            setFilteredData(data);
            setIsSearching(false);
        }
    };
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm && searchTerm.length >= 3) {
                try {
                    const { user } = auth;
                    const token = user?.token || '';
                    const result = await getEmployeeByTerm(searchTerm, token);
                    setFilteredData(Array.isArray(result) ? result : [result]);
                } catch (error) {
                    console.error("Error al obtener empleados:", error);
                    // Mantenemos los resultados locales en caso de error
                }
            }
        }, 300);
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, auth]);
    
    useEffect(() => {
        if (!isSearching) {
            setFilteredData(data);
        }
    }, [data, isSearching]);

    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Ingresos</Heading>

            <FormControl id="filter" width={{ base: "55%", sm: "50%", md: "40%", lg: "20%" }} >
            <FormLabel fontSize="sm">Buscar por Nombre</FormLabel>
                    <Input
                        value={searchTerm}
                        onChange={handleTermFilter}
                        size="sm" rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    />
                </FormControl>

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
                        {filteredData.map((datum) => (
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
            {!isSearching && (
            <Pagination setEmployeedata={setEmployeeData} total={total} />
        )}

        </Flex >
    );
}