'use client'

import React, { act, useCallback, useEffect, useState } from "react";
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
  useToast,
  Switch
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/components/context/AuthProvider";
import { positionSchema } from "@/validations/positionSchema";
import { createPositionDetails } from "@/utils/detail.http";
import { useParams } from "next/navigation";
import { getPositionTypes } from "@/utils/position.utils";
import { getConfigAmount } from "@/utils/configBasic.http";

const SALARIO_MINIMO = 2680373;

interface PositionIDProps {
  id: string;
  name: string;
}

interface AddPositionInDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  employDetails?: Omit<PositionFormValues, 'positionId'> & { positionId: string };
  types: PositionIDProps[];
}

interface PositionFormValues {
  employeeId: string;
  positionId: string;
  startDate: string;
  active: boolean;
  salaryType: 'minimum' | 'base';
  amount: number | string;
}

export const AddPositionInDetails: React.FC<AddPositionInDetailsProps> = ({ isOpen, onClose, fetchData }) => {
  const toast = useToast();
  const auth = useAuth();
  const { id } = useParams();

  const [isPosition, setIsPosition] = useState<PositionIDProps[]>([]);
  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema)
  });

  const [isDisabled, setIsDisabled] = useState(false); // Initially set to false
  const [initialStartDate, setInitialStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [salarioMinimo, setSalarioMinimo] = useState(2680373);
  const salaryType = watch('salaryType');

  const fetchDataPosition = useCallback(async () => {
    const employeeId = typeof id === "string" ? id : "";
    const { user } = auth;
    const token = user?.token || '';
    const positionTypesResponse = await getPositionTypes(token);
    setIsPosition(positionTypesResponse.data);
    const data = await getConfigAmount(token);
    console.log(data);
    const value = data.filter((item: any) => item.name === 'Salario Minimo')[0].value;
    console.log(value);
    setSalarioMinimo(value);
  }, [auth, id]);

  const onSubmit = async (data: PositionFormValues) => {
    try {
      const { user } = auth;
      const token = user?.token || '';
      console.log('Datos del formulario:', data);
      const newPosition = {
        employeeId: id,
        positionId: data.positionId,
        startDate: new Date(data.startDate),
        salaryType: data.salaryType,
        active: data.active == undefined ? true : data.active,
        salary: typeof data.amount === 'number' ? data.amount : Number(data.amount), // Ensure salary is a number
      };

      console.log('Datos a enviar:', newPosition);
      setIsDisabled(true);
      toast({
        title: 'Guardando',
        description: 'Por favor espere...',
        status: 'loading',
        duration: null,
        isClosable: true,
      });

      const response = await createPositionDetails(newPosition, token);
      setIsDisabled(false);
      toast.closeAll();
      toast({
        title: 'Guardado',
        description: 'Cargo agregado con éxito',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setValue('employeeId', '');
      setValue('positionId', '' as any);
      setValue('salaryType', 'base');
      setValue('startDate', new Date().toISOString().split('T')[0]);
      setValue('amount', '');
      fetchData();
      onClose();
    } catch (error) {
      toast.closeAll();
      toast({
        title: 'Error',
        description: 'Error al guardar el Cargo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsDisabled(false);
      console.error('Error saving position:', error);
    }
  };



  useEffect(() => {
    fetchDataPosition();
    setValue('employeeId', '');
    setValue('positionId', '' as any);
    setValue('salaryType', 'base');
    setValue('startDate', new Date().toISOString().split('T')[0]);
    setValue('amount', '');
    setValue('active', true);
  }, [auth, setValue, fetchDataPosition]);

  useEffect(() => {
    if (salaryType === 'minimum') {
      setValue('amount', salarioMinimo);
    }
  }, [salaryType, setValue, salarioMinimo]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar</ModalHeader>
        <ModalCloseButton />
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
              <Select id="salaryType"  {...register('salaryType')}>
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

            <FormControl isInvalid={!!errors.active}>
              <FormLabel htmlFor="active">Activo</FormLabel>
              <Switch id="active" {...register('active')} type="switch" />
              <FormErrorMessage>{errors.active && errors.active.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.amount}>
              <FormLabel htmlFor="amount">Salario:</FormLabel>
              {salaryType === 'minimum' ? (
                <Input
                  isDisabled={true}
                  type="number"
                  id="amount"
                  value={salarioMinimo}
                  {...register('amount', {
                    value: salarioMinimo,
                  })}
                />
              ) : (
                <Input type="number" id="amount" {...register('amount')} />
              )}
              <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
            </FormControl>
            <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} isDisabled={isDisabled} type="submit" display="block" mx="auto">
              Guardar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
