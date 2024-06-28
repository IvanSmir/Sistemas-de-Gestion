'use client'

import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button, Heading, Input, FormControl, FormLabel } from '@chakra-ui/react';
import React, { ChangeEvent, useState, useEffect } from 'react';
import Pagination from './Pagination';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import VerifiedModal from '../general/salaries/VerifiedModal';
import Period from "@/types/period";
import { AddIcon } from '@chakra-ui/icons';
import { DownloadExcel } from '../employees/reportEmployee/report';
import { getEmployeeByTerm } from '@/utils/employee.http';
import { useAuth } from "../context/AuthProvider";
import { truncate } from 'fs';
import { TbRuler } from 'react-icons/tb';

type TableEmployeeProps = {
    data: { id: string; [key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    setEmployeeData?: any;
    total: number;
    isSalary?: boolean;
}

export const TableEmployee: React.FC<TableEmployeeProps> = ({ data, columnMapping, setEmployeeData, total, isSalary }) => {
    const [showDownload, setShowDownload] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmOperation, setConfirmOperation] = useState(false);
    const [operation, setOperation] = useState("Generar");
    const [cierre, setCierre] = useState(false);
    const [verify, setVerify] = useState(false);
    const [isGenerar, setIsGenerar] = useState(false);
    const [isProcessClosed, setIsProcessClosed] = useState(false);
    const headers = Object.keys(columnMapping);
    const auth = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [isSearching, setIsSearching] = useState(false);
    
    const handleTermFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (term.length >= 3) {
            setIsSearching(true);
            // Búsqueda local inmediata
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


    const handleOperation = (operationType: string) => {
        setConfirmOperation(false);
        setOperation(operationType);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (operation === "Cierre") {
            setIsProcessClosed(true);
        }
    };

    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Funcionarios</Heading>

            <Box marginTop={6} width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} height={"70vh"}>
            <FormControl id="filter" width={{ base: "55%", sm: "50%", md: "40%", lg: "20%" }} >
            <FormLabel fontSize="sm">Buscar por RUC o Nombre</FormLabel>
                    <Input
                        value={searchTerm}
                        onChange={handleTermFilter}
                        size="sm" rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    />
                </FormControl>
                <Flex justifyContent="end" mb={6} flexWrap="wrap">
                    <DownloadExcel />

                    <Link href="/employees/add">
                        <Button
                            rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'
                        >
                            <AddIcon />Agregar Funcionario
                        </Button>
                    </Link>

                </Flex>
                <Box backgroundColor="white" borderRadius="2xl" padding="8px">

                    <TableContainer height={"60vh"}>
                        <Table variant="simple" fontSize="14px">
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

                                        <Td textAlign="center" verticalAlign="middle">

                                            <Link className='text-blue-500' href={`/employees/${datum.id}`}>
                                                Detalles
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
            </Box >
        </Flex>
    );
}

