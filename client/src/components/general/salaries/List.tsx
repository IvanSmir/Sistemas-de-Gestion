'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button, Checkbox } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from '../../lists/Pagination';
import Link from 'next/link';
import VerifiedModal from './VerifiedModal';
import PayrollDetail from "@/types/period";
import { useParams } from 'next/navigation';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline, IoIosCloseCircle, IoIosCloseCircleOutline } from 'react-icons/io';
// Definimos los tipos para las props
type PaymentsProps = {
    payments: PayrollDetail[];
}

export const TableSalaries: React.FC<PaymentsProps> = ({ payments }) => {
    const { periodsId } = useParams();
    return (
        <Box marginTop={6} width={{ base: "90%", sm: "80%", md: "90%", lg: "90%", xl: "90%", "2xl": "90%" }} >
            <TableContainer>
                <Table variant="simple" fontSize={{ base: "12px", sm: "13px", md: "14px", lg: "15px", xl: "16px", "2xl": "17px" }}>
                    <Thead>
                        <Tr>
                            <Th >Nombre</Th>
                            <Th >CI/RUC</Th>
                            <Th>Detalle</Th>
                            <Th>Recibo</Th>
                            <Th>Verificado</Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {payments?.length === 0 ? <Tr><Td>No hay salarios registrados</Td></Tr>


                            : payments?.map((datum) => (
                                <Tr key={datum.id}>
                                    <Td>{datum.employee.person.name}</Td>
                                    <Td>{datum.employee.person.ciRuc}</Td>
                                    <Td>
                                        <Link className='text-blue-500' href={`/general/salaries/periods/${periodsId}/${datum.id}`}>
                                            Detalles
                                        </Link>
                                    </Td>
                                    <Td>
                                        <Link href={`/general/salaries/periods/details/${datum.id}`}>
                                            Recibo
                                        </Link>
                                    </Td>
                                    <Td>
                                        {datum.isVerified ? <IoIosCheckmarkCircle color='green' /> : <IoIosCloseCircle color='red' />}
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box >
    );
}
