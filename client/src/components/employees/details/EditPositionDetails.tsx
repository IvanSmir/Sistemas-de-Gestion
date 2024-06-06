'use client'

import React, { useCallback, useEffect, useState } from "react";
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
import { employeeDetailsSchema } from "@/validations/employeeDetailsSchema";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/components/context/AuthProvider";
import { positionSchema } from "@/validations/positionSchema";
import { updatePositionDetails, getEmployeeDetails } from "@/utils/detail.http";
import { useParams } from "next/navigation";
import { getPositionTypes } from "@/utils/position.utils";
const SALARIO_MINIMO = 2680373;

interface EditPositionInDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
    positionId: string | null;
}
interface PositionType {
    id: string;
    name: string;
}
interface PositionFormValues{
    employeeId: string;
    positionId : string;
    startDate: string;
    endDate: string;
    salaryType: 'minimum' | 'base';
    salary: number | string;
}

export const EditPositionInDetails: React.FC<EditPositionInDetailsProps> = ({isOpen, onClose, fetchData, positionId}) => {
    const toast = useToast();
    const auth = useAuth();
    const { id } = useParams();
   
    const [isPosition, setIsPosition] = useState<PositionType[]>([]);
   
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PositionFormValues>({ 
      resolver: zodResolver(employeeDetailsSchema)
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [initialStartDate, setInitialStartDate] = useState(new Date().toISOString().split('T')[0]);
    const salaryType = watch('salaryType');
  
    const fetchDataPosition = useCallback(async () => {
        const { user } = auth;
        const token = user?.token || '';
        const positionTypesResponse = await getPositionTypes(token);
        setIsPosition(positionTypesResponse.data);
    }, [auth]);

    const fetchPositionDetails = useCallback(async () => {
        if (positionId) {
            const { user } = auth;
            const token = user?.token || '';
            const positionDetails = await getEmployeeDetails(positionId, token);
            if (positionDetails && positionDetails.position) {
              setValue('employeeId', positionDetails.employeeId);
              setValue('positionId', positionDetails.position.id);
              setValue('startDate', positionDetails.startDate);
              setValue('endDate', positionDetails.endDate);
              setValue('salaryType', positionDetails.salaryType);
              setValue('salary', positionDetails.salary);
          }
          
        }
    }, [positionId, auth, setValue]);

    const onSubmit = async (values: PositionFormValues) => {
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
                id: positionId,
                employeeId: id,
                position: { id: values.positionId, name: '' },
                startDate: values.startDate,
                endDate: values.endDate,
                salaryType: values.salaryType,
                salary: typeof values.salary === 'number' ? values.salary : Number(values.salary),
            };
            
            await updatePositionDetails(positionId as string,updatedPosition, token);
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
        fetchDataPosition();
        fetchPositionDetails();
    }, [fetchDataPosition, fetchPositionDetails]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel htmlFor="startDate">Fecha inicio:</FormLabel>
                            <Input id="startDate" {...register('startDate')} />
                            <FormErrorMessage>{errors.startDate && errors.startDate.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="endDate">Fecha fin:</FormLabel>
                            <Input id="endDate" {...register('endDate')} />
                            <FormErrorMessage>{errors.endDate && errors.endDate.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="salary">Salario:</FormLabel>
                            {salaryType === 'minimum' ? (
                                <Input
                                    type="number"
                                    id="salary"
                                    value={SALARIO_MINIMO}
                                    {...register('salary', {
                                        value: SALARIO_MINIMO,
                                    })}
                                />
                            ) : (
                                <Input type="number" id="salary" {...register('salary')} />
                            )}
                            <FormErrorMessage>{errors.salary && errors.salary.message}</FormErrorMessage>
                        </FormControl>
                        
                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Button mr={3} onClick={onClose} colorScheme="gray">
                                Cancelar
                            </Button>
                            <Button colorScheme="teal" type='submit'>
                                Guardar
                            </Button>
                        </Box>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
