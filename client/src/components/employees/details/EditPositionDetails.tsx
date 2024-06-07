'use client';

import React, { useCallback, useEffect, useState } from "react";
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
import { employeeDetailsSchema } from "@/validations/employeeDetailsSchema";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/components/context/AuthProvider";
import { updatePositionDetails, getEmployeeDetailById } from "@/utils/detail.http";
import { useParams } from "next/navigation";
import { getPositionTypes } from "@/utils/position.utils";
import { getConfigAmount } from "@/utils/configBasic.http";

const SALARIO_MINIMO = 2680373;

interface EditPositionInDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
    positionId: string | null;
}

interface PositionIDProps {
    id: string;
    name: string;
}

interface PositionFormValues {
    employeeId: string;
    positionId: string;
    startDate: string;
    endDate: string;
    salaryType: 'minimum' | 'base';
    salary: number | string;
}

export const EditPositionInDetails: React.FC<EditPositionInDetailsProps> = ({ isOpen, onClose, fetchData, positionId, }) => {
    console.log('positionId', positionId);
    const toast = useToast();
    const auth = useAuth();
    const { id } = useParams();

    const [isPosition, setIsPosition] = useState<PositionIDProps[]>([]);
    const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<PositionFormValues>({
        resolver: zodResolver(employeeDetailsSchema)
    });

    const [isDisabled, setIsDisabled] = useState(false);
    const [initialStartDate, setInitialStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const salaryType = watch('salaryType');
    const [salarioMinimo, setSalarioMinimo] = useState(2680373);
    const [values, setValues] = useState<any>(null);

    const fetchDataPosition = useCallback(async () => {
        const { user } = auth;
        const token = user?.token || '';
        const positionTypesResponse = await getPositionTypes(token);
        setIsPosition(positionTypesResponse.data);
        const data = await getConfigAmount(token);
        const value = data.filter((item: any) => item.name === 'Salario Minimo')[0].value;
        setSalarioMinimo(value);
    }, [auth]);

    const fetchPositionDetails = useCallback(async () => {
        if (positionId) {
            const { user } = auth;
            const token = user?.token || '';
            const positionDetails = await getEmployeeDetailById(positionId, token);
            if (positionDetails && positionDetails.position) {
                setValue('employeeId', positionDetails.employeeId || '');
                setValue('positionId', positionDetails.positionId || '');
                setValue('startDate', positionDetails.startDate ? positionDetails.startDate.split('T')[0] : '');
                setValue('endDate', positionDetails.endDate ? positionDetails.endDate.split('T')[0] : '');
                setValue('salaryType', positionDetails.salaryType || '');
                setValue('salary', positionDetails.salary || '');
            }
        }
        setIsLoading(false);
    }, [positionId, auth, setValue]);

    const onSubmit = async () => {
        console.log('Triggering validation...');
        const isValid = await trigger();
        console.log('Validation result:', isValid);
        if (!isValid) {
            console.log('Validation errors:', errors);
            return;
        }

        handleSubmit((data) => {
            console.log('Form data after submission:', data);
            setValues(data);
        })();

        try {
            const { user } = auth;
            const token = user?.token || '';
            setIsDisabled(true);
            toast({
                title: 'Guardando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            const updatedPosition = {
                positionId: values.positionId,
                startDate: new Date(values.startDate),
                endDate: new Date(values.endDate),
                salaryType: values.salaryType,
                salary: typeof values.salary === 'number' ? values.salary : Number(values.salary),
            };

            await updatePositionDetails(positionId as string, updatedPosition, token);
            setIsDisabled(false);
            toast.closeAll();
            toast({
                title: 'Guardado',
                description: 'Cargo actualizado con éxito',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            fetchData();
            onClose();
        } catch (error) {
            toast.closeAll();
            toast({
                title: 'Error',
                description: 'Error al actualizar el Cargo',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsDisabled(false);
            console.error('Error updating position:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchDataPosition();
            fetchPositionDetails();
        }
    }, [isOpen, fetchDataPosition, fetchPositionDetails, id]);

    useEffect(() => {
        if (salaryType === 'minimum') {
            setValue('salary', salarioMinimo);
        }
    }, [salaryType, setValue, salarioMinimo]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoading ? (
                        <div>Cargando...</div>
                    ) : (
                        <form>
                            <FormControl isInvalid={!!errors.positionId}>
                                <FormLabel htmlFor="positionId">Posición:</FormLabel>
                                <Select id="positionId" {...register('positionId')}>
                                    {isPosition.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.positionId && errors.positionId.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.salaryType}>
                                <FormLabel htmlFor="salaryType">Tipo de salario:</FormLabel>
                                <Select id="salaryType" {...register('salaryType')}>
                                    <option value="minimum">Mínimo</option>
                                    <option value="base">Base</option>
                                </Select>
                                <FormErrorMessage>{errors.salaryType && errors.salaryType.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel htmlFor="startDate">Fecha inicio:</FormLabel>
                                <Input id="startDate" {...register('startDate')} type="date" />
                                <FormErrorMessage>{errors.startDate && errors.startDate.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel htmlFor="endDate">Fecha fin:</FormLabel>
                                <Input id="endDate" {...register('endDate')} type="date" />
                                <FormErrorMessage>{errors.endDate && errors.endDate.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.salary}>
                                <FormLabel htmlFor="salary">Salario:</FormLabel>
                                {salaryType === 'minimum' ? (
                                    <Input
                                        type="number"
                                        id="amount"
                                        value={salarioMinimo}
                                        {...register('salary')}
                                    />
                                ) : (
                                    <Input type="number" id="salary" {...register('salary')} />
                                )}
                                <FormErrorMessage>{errors.salary && errors.salary.message}</FormErrorMessage>
                            </FormControl>
                            <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} isDisabled={isDisabled} onClick={onSubmit} display="block" mx="auto">
                                Guardar
                            </Button>
                        </form>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
