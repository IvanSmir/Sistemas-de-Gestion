'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button, Heading } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from './Pagination'
import Link from 'next/link';
import VerifiedModal from '../general/salaries/VerifiedModal';
import Period from "@/types/period";
import { AddIcon } from '@chakra-ui/icons';
// Definimos los tipos para las props
type TableEmployeeProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
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
    const [filters, setFilters] = useState<{ ci: string; ageRange: string }>({
        ci: '',
        ageRange: '',
    });

    const handleCiFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ci: e.target.value });
    };



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
                <Flex justifyContent="end" mb={6} flexWrap="wrap">


                    <Link href="/employees/add">
                        <Button
                            rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'
                        >
                            <AddIcon />Agregar Funcionario
                        </Button>
                    </Link>



                </Flex>
                <Box backgroundColor="white" borderRadius="2xl" padding="8px">

                    <TableContainer>
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
                                {data.map((datum) => (
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
                <Pagination setEmployeedata={setEmployeeData} total={total} />
            </Box >
        </Flex>
    );
}
