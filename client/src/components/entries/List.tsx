
'use client'
import React, { useState, useEffect } from 'react';
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
    Heading,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ModalDetalles } from './ModalDetalles';
import { getLastSalaryPayments } from '@/utils/payroll';
import { useAuth } from "../context/AuthProvider";

interface SalaryPayment {
    id: string;
    createdAt: string;
    name: string;
    netAmount: number;
    paymentDate: string;
    type: 'DEBE' | 'HABER';
}

export const List: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<SalaryPayment | null>(null);
    const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
    const [periodInfo, setPeriodInfo] = useState<{ name: string, paymentDate: string } | null>(null);
    const auth = useAuth();

    useEffect(() => {
        const fetchSalaryPayments = async () => {
            try {
                const token = auth?.user?.token || '';
                const payments = await getLastSalaryPayments(token);
                setSalaryPayments(payments);
                if (payments.length > 0) {
                    const firstPayment = payments[0];
                    setPeriodInfo({
                        name: firstPayment.name,
                        paymentDate: new Date(firstPayment.paymentDate).toLocaleDateString(),
                    });
                }
            } catch (error) {
                console.error('Error al obtener los pagos de salarios:', error);
            }
        };

        fetchSalaryPayments();
    }, [auth]);

    const handleViewDetails = (payment: SalaryPayment) => {
        setSelectedPayment(payment);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedPayment(null);
    };

    return (
        <Flex justifyContent="center" mt={20}>
            <Box backgroundColor="white" borderRadius="2xl" padding="16px">
                {periodInfo && (
                    <Flex justifyContent="center" alignItems="center" mb={4}>
                        <Flex direction="column" textAlign="center">
                            <Heading color="gray.600" fontSize="24px" mb={2}>{periodInfo.name}</Heading>
                            <Heading color="gray.600" fontSize="sm">{`Fecha de Periodo: ${periodInfo.paymentDate}`}</Heading>
                        </Flex>
                    </Flex>
                )}
                <TableContainer>
                    <Table variant="simple" fontSize="14px">
                        <Thead>
                            <Tr>
                                <Th>Tipo</Th>
                                <Th>Debe</Th>
                                <Th>Haber</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {salaryPayments.map((payment) => (
                                <Tr key={payment.id}>
                                    <Td>{payment.name}</Td>
                                    <Td>{payment.type === 'DEBE' ? payment.netAmount.toFixed(2) : '-'}</Td>
                                    <Td>{payment.type === 'HABER' ? payment.netAmount.toFixed(2) : '-'}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Flex>
    );
};




