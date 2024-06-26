'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button, Checkbox, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { ChangeEvent, useState, useEffect } from 'react'
import Link from 'next/link';
import VerifiedModal from './VerifiedModal';
import PayrollDetail from "@/types/period";
import { useParams } from 'next/navigation';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline, IoIosCloseCircle, IoIosCloseCircleOutline } from 'react-icons/io';
import PaginationSalaries from './Pagination';
// Definimos los tipos para las props
type PaymentsProps = {
    payments: PayrollDetail[];
}

export const TableSalaries: React.FC<PaymentsProps> = ({ payments }) => {
    const { periodsId } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(7);

    const [filters, setFilters] = useState({
        name: '',
        ciRuc: '',
    });

    const [filteredPayments, setFilteredPayments] = useState<PayrollDetail[]>(payments);

    useEffect(() => {
        const filtered = payments.filter((payment) => {
            const { name, ciRuc } = payment.employee.person;
            const nameMatch = name.toLowerCase().includes(filters.name.toLowerCase());
            const ciRucMatch = ciRuc.toLowerCase().includes(filters.ciRuc.toLowerCase());
            return nameMatch && ciRucMatch;
        });
        setFilteredPayments(filtered);
    }, [filters, payments]);

    const handleFilterNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, name: e.target.value });
    };

    const handleFilterCIChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ciRuc: e.target.value });
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPayments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    return (
        <Box width={{ base: "90%", sm: "80%", md: "90%", lg: "90%", xl: "90%", "2xl": "90%" }} height={"70vh"} >
            <Flex gap={2} align="center" justify="flex-start" flexWrap="wrap">
                <FormControl id="filterName" width={{ base: "45%", sm: "40%", md: "30%", lg: "20%" }} >
                    <FormLabel fontSize="sm">Filtrar por Nombre</FormLabel>
                    <Input type="text" value={filters.name} onChange={handleFilterNameChange} size="sm" rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}/>
                </FormControl>
                <FormControl id="filterCI" width={{ base: "45%", sm: "40%", md: "30%", lg: "20%" }}>
                    <FormLabel fontSize="sm">Filtrar por CI/RUC</FormLabel>
                    <Input type="text" value={filters.ciRuc} onChange={handleFilterCIChange} size="sm" rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }} />
                </FormControl>
            </Flex>
            <TableContainer height={"65vh"}>
                <Table variant="simple" fontSize={{ base: "12px", sm: "13px", md: "14px", lg: "14px", xl: "14px", "2xl": "14px" }}>
                    <Thead>
                        <Tr>
                            <Th >Nombre</Th>
                            <Th >CI/RUC</Th>
                            <Th>Detalle</Th>
                            <Th textAlign="center">Verificado</Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentRecords.length === 0 ? <Tr><Td colSpan={5}>No hay salarios registrados</Td></Tr>


                            : currentRecords?.map((datum) => (
                                <Tr key={datum.id}>
                                    <Td>{datum.employee.person.name}</Td>
                                    <Td>{datum.employee.person.ciRuc}</Td>
                                    <Td>
                                        <Link className='text-blue-500' href={`/general/salaries/periods/${periodsId}/${datum.id}`}>
                                            Detalles
                                        </Link>
                                    </Td>
                                    <Td display={"flex"} justifyContent={"center"}>
                                        {datum.isVerified ? <IoIosCheckmarkCircle size={"1.4rem"} color='green' /> : <IoIosCloseCircle size={"1.4rem"} color='red' />}
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {totalPages > 1 && (
                <Flex justifyContent="center" >
                    <PaginationSalaries
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Flex>
            )}
        </Box >
    );
}
