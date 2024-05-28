'use client'
import React, { useEffect, useState } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Box,
    ModalOverlay,
    ModalContent,
    Modal,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormErrorMessage,
    useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/components/context/AuthProvider";
import { createIncome, createExpense } from "@/utils/finance.http";
import { incomeExpenseSchema } from "@/validations/incomeExpenseSchema";
import { useParams } from "next/navigation";

interface IncomeExpenseType {
    id: string;
    name: string;
}

interface IncomeExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
    isIncomeorExpense: string;
    types: IncomeExpenseType[];
}

interface IncomeExpenseFormValues {
    typeId: string;
    amount: number;
}

export const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({ isOpen, onClose, fetchData, isIncomeorExpense, types }) => {
    const toast = useToast();
    const auth = useAuth();
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IncomeExpenseFormValues>({ resolver: zodResolver(incomeExpenseSchema) });

    const onSubmit = async (values: IncomeExpenseFormValues) => {
        console.log('values', values);

        if (isIncomeorExpense === 'income') {
            try {
                toast.closeAll();
                toast({
                    title: 'Guardando',
                    description: 'Por favor espere...',
                    status: 'loading',
                    duration: null,
                    isClosable: true,
                });
                const { user } = auth;
                const token = user?.token || '';
                const newIncome = {
                    employeeId: id,
                    incomeTypeId: values.typeId,
                    amount: values.amount,
                    date: new Date(),
                    active: true,
                }
                const data = await createIncome(newIncome, token);
                toast.closeAll();
                toast({
                    title: 'Guardado',
                    description: 'Ingreso agregado con éxito',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchData();
                onClose();


            }
            catch (error) {
                toast.closeAll();
                toast({
                    title: 'Error',
                    description: 'Error al guardar el ingreso',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                console.error('Error saving income/expense:', error);

            }
        } else if (isIncomeorExpense === 'expense') {
            try {
                toast.closeAll();
                toast({
                    title: 'Guardando',
                    description: 'Por favor espere...',
                    status: 'loading',
                    duration: null,
                    isClosable: true,
                });
                const { user } = auth;
                const token = user?.token || '';
                const newExpense = {
                    employeeId: id,
                    expenseTypeId: values.typeId,
                    amount: values.amount,
                    date: new Date(),
                    active: true,
                }
                const data = await createExpense(newExpense, token);
                toast.closeAll();
                toast({
                    title: 'Guardado',
                    description: 'Egreso agregado con éxito',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchData();
                onClose();


            }
            catch (error) {
                toast.closeAll();
                toast({
                    title: 'Error',
                    description: 'Error al guardar el egreso',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                console.error('Error saving income/expense:', error);

            }
        }

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Agregar {isIncomeorExpense == 'income' ? 'Ingreso' : 'Egreso'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={!!errors.typeId}>
                            <FormLabel htmlFor="typeId">Tipo:</FormLabel>
                            <Select id="typeId" {...register('typeId')}>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.typeId && errors.typeId.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.amount}>
                            <FormLabel htmlFor="amount">Monto:</FormLabel>
                            <Input type="number" id="amount" {...register('amount')} />
                            <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type='submit' display="block" mx="auto">
                            Guardar
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
