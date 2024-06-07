'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button, Checkbox } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
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

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = payments ? payments.slice(indexOfFirstRecord, indexOfLastRecord) : [];

    const totalPages = payments ? Math.ceil(payments.length / recordsPerPage) : 0;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    return (
        <Box width={{ base: "90%", sm: "80%", md: "90%", lg: "90%", xl: "90%", "2xl": "90%" }} height={"70vh"} >
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
                                        {datum.isVerified ? <IoIosCheckmarkCircle color='green' /> : <IoIosCloseCircle color='red' />}
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
