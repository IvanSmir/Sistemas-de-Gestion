'use client';
import React, { useState } from 'react';
import {
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    Heading,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ModalDetalles } from './ModalDetalles';

interface EntryDetail {
    account: string;
    debe: number;
    haber: number;
}

interface SalaryPayment {
    id: string;
    period: string;
    description: string;
    details: EntryDetail[];
}

const salaryPayments: SalaryPayment[] = [
    {
        id: '1',
        period: '2024-06-13',
        description: 'Pago de salarios',
        details: [
            { account: 'Salarios por Pagar', debe: 0, haber: 5000 },
            { account: 'Efectivo', debe: 5000, haber: 0 },
        ],
    },
    {
        id: '2',
        period: '2024-07-13',
        description: 'Pago de salarios',
        details: [
            { account: 'Salarios por Pagar', debe: 0, haber: 5000 },
            { account: 'Efectivo', debe: 5000, haber: 0 },
        ],
    },
    {
        id: '3',
        period: '2024-08-13',
        description: 'Pago de salarios',
        details: [
            { account: 'Salarios por Pagar', debe: 0, haber: 5000 },
            { account: 'Efectivo', debe: 5000, haber: 0 },
        ],
    },
];

export const List: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPayment, setSelectedPayment] = useState<SalaryPayment | null>(null);

    const handleViewDetails = (payment: SalaryPayment) => {
        setSelectedPayment(payment);
        onOpen();
    };

    return (
        <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >
                <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Asientos de Pago de Salarios</Heading>
                    <Flex justifyContent="space-between" mb={6}>    
                        <Flex gap={2}>
                            {/* Aquí puedes agregar un filtro por nombre si lo necesitas */}
                        </Flex>
                    </Flex>
                    <TableContainer>
                        <Table variant="simple" fontSize="14px">
                            <Thead>
                                <Tr>
                                    <Th>Periodo</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                            {salaryPayments.map((payment) => (
                                <Tr key={payment.id}>
                                    <Td>{payment.period}</Td>
                                    <Td>
                                        <ViewIcon
                                            cursor="pointer"
                                            onClick={() => handleViewDetails(payment)}
                                        >
                                        </ViewIcon>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                        </Table>
                    </TableContainer>
                <ModalDetalles isOpen={isOpen} onClose={onClose} entry={selectedPayment} />
        </Box>
    );
};


