'use client'

import React, { useEffect } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
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
import { updateIncome, updateExpense } from "@/utils/finance.http";
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
    details: any;
    itemId: string;
}

interface IncomeExpenseFormValues {
    typeId: string;
    amount: number;
}

export const EditIncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({ isOpen, onClose, isIncomeorExpense, types, fetchData, details, itemId }) => {
    const toast = useToast();
    const auth = useAuth();
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IncomeExpenseFormValues>({ resolver: zodResolver(incomeExpenseSchema) });
    useEffect(() => {
        if (details) {
            console.log("Detalles del elemento en el formulario de edición:", details);
            setValue('typeId', details.typeId);
            setValue('amount', details.amount);
        }
    }, [details, setValue]);

    const onSubmit = async (values: IncomeExpenseFormValues) => {
        try {
            toast.closeAll();
            toast({
                title: 'Guardando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: 1000,
                isClosable: true,
            });

            if (isIncomeorExpense === 'income') {
                const { user } = auth;
                const token = user?.token || '';

                const newData = {
                    employeeId: id,
                    incomeTypeId: values.typeId,
                    amount: values.amount,
                    active: true,
                };
                await updateIncome(itemId, newData, token);
                toast({
                    title: 'Guardado',
                    description: 'Ingreso actualizado con éxito',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else if (isIncomeorExpense === 'expense') {
                const { user } = auth;
                const token = user?.token || '';
                const newData = {
                    employeeId: id,
                    expenseTypeId: values.typeId,
                    amount: values.amount,
                    active: true,
                };
                await updateExpense(itemId, newData, token);
                toast({
                    title: 'Guardado',
                    description: 'Egreso actualizado con éxito',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }

            fetchData();
            onClose();
        } catch (error) {
            toast.closeAll();
            toast({
                title: 'Error',
                description: 'Error al actualizar el egreso o ingreso',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar {isIncomeorExpense === 'income' ? 'Ingreso' : 'Egreso'}</ModalHeader>
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
