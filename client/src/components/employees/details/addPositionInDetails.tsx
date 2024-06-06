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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/components/context/AuthProvider";
import { positionSchema } from "@/validations/positionSchema";
import { createPositionDetails } from "@/utils/detail.http";
import { useParams } from "next/navigation";
import { getPositionTypes } from "@/utils/position.utils";
const SALARIO_MINIMO = 2680373;

interface AddPositionInDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}
interface prositionIDProps{
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
export const AddPositionInDetails: React.FC<AddPositionInDetailsProps> = ({isOpen,onClose,fetchData}) => {
  const toast = useToast();
  const auth = useAuth();
  const { id } = useParams();
 
  const [isPosition, setIsPosition] = useState<prositionIDProps[]>([]);
 
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PositionFormValues>({ 
    resolver: zodResolver(positionSchema)
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [initialStartDate, setInitialStartDate] = useState(new Date().toISOString().split('T')[0]);
  const salaryType = watch('salaryType');


  const fetchDataPosition = useCallback(async () => {
    const employeeId = typeof id === "string" ? id : "";
    const { user } = auth;
    const token = user?.token || '';
    const positionTypesResponse = await getPositionTypes( token);
    setIsPosition(positionTypesResponse.data);
  }, [auth]);


  const onSubmit = async (values: PositionFormValues) => {
        console.log('Form values:', values);
        console.log('Employee ID being submitted:', id);
        try {
          const { user } = auth;
          const token = user?.token || '';
          console.log('relative', { ...values });
          setIsDisabled(true);
          toast({
            title: 'Guardando',
            description: 'Por favor espere...',
            status: 'loading',
            duration: null,
            isClosable: true,
          });
          
            const newPosition = {
              employeeId: id,
              position :{ id: values.positionId, name: '' },
              startDate: values.startDate,
              endDate: values.endDate,
              salaryType: values.salaryType,
              salary: typeof values.salary === 'number' ? values.salary : Number(values.salary), // Asegurarse de que salary sea un número
            };
            
            const data = await createPositionDetails(newPosition, token);
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
            setValue('positionId', '');
            setValue('salaryType','base');
            setValue('startDate', '');
            setValue('salary', '');
            setValue('endDate', ''); 
            fetchData();
            onClose();
          }catch (error) {
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
      fetchData();
      setValue('employeeId', '');
      setValue('positionId', '' as any);
      setValue('salaryType','base');
      setValue('startDate', '');
      setValue('salary', '');
      setValue('endDate', ''); 
  }, [auth, setValue, fetchDataPosition]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agregar</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.positionId}>
                  <FormLabel htmlFor="positionId">Posición:</FormLabel>
                  <Select id="positionId" {...register('positionId')}>
                    {isPosition.map((type)=>(
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
                  <Button  mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type='submit' display="block" mx="auto" >
                    Guardar
                  </Button>
                 </form>
            </ModalBody>
          </ModalContent>
    </Modal>
  )
}
