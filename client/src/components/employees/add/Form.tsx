'use client'
import React, { Dispatch, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import Image from "next/image";
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage, Flex, Toast, useToast } from '@chakra-ui/react';
import Employee from "@/types/employee";
import { getPerson } from '@/utils/person.http';
import { useAuth } from '@/components/context/AuthProvider';
import { useRouter } from 'next/navigation';
interface FormEmployeeProps {
    register: UseFormRegister<Employee>;
    errors: FieldErrors<Employee>;
    setIsPerson: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<Employee>
    setEmployeeCiRuc: React.Dispatch<React.SetStateAction<string>>;

}

const cedulaRegex = /^\d{6,8}$/;
const rucRegex = /^\d{1,8}-\d$/;
const normalizeRUC = (ruc: string) => ruc.replace(/\./g, '');
const denormalizeCi = (ci: string) => ci.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const FormEmployee: React.FC<FormEmployeeProps> = ({ register, errors, setIsPerson, setValue, setEmployeeCiRuc }) => {
    const toast = useToast();
    const auth = useAuth();
    const [ruc, setRuc] = useState('');
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(true);
    const getErrorMessage = (error: any) => {
        if (error && typeof error.message === 'string') {
            return error.message;
        }
        return '';
    };
    const isRuc = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            let rucToCheck = ruc;
            if (!ruc.includes('-')) {
                rucToCheck = denormalizeCi(ruc);
                setRuc(rucToCheck);
            }

            if (rucToCheck.trim() === '') {
                toast({
                    title: 'Info',
                    description: 'El CI/RUC no puede estar vacío',
                    status: 'info',
                    duration: 1000,
                    isClosable: true,
                });
                return;
            }

            if (!cedulaRegex.test(normalizeRUC(rucToCheck)) && !rucRegex.test(rucToCheck)) {
                toast({
                    title: 'Info',
                    description: 'El CI/RUC debe ser un número de cédula o RUC válido',
                    status: 'info',
                    duration: 1000,
                    isClosable: true,
                });
                return;
            }



            const employeeResponse = await getPerson(rucToCheck, token);

            console.log(employeeResponse);
            if (employeeResponse.isEmployee) {
                toast({
                    title: 'Redireccionando...',
                    description: 'Un empleado con ese CI/RUC ya existe',
                    status: 'loading',
                    duration: 1000,
                    isClosable: true,
                });
                router.push(`/employees/${employeeResponse.idEmployee}`);
            }
            else {
                toast({
                    title: 'Info',
                    description: 'Ya existe una persona con ese CI/RUC',
                    status: 'info',
                    duration: 1000,
                    isClosable: true,
                });
                setIsPerson(true);
                setIsDisabled(true);
                setValue('name', employeeResponse.name);
                setValue('email', employeeResponse.email);
                setValue('address', employeeResponse.address);
                setValue('phone', employeeResponse.phone);
                setValue('birthDate', employeeResponse.birthDate.split('T')[0]);
                setValue('gender', employeeResponse.gender);
            }

        } catch (error: any) {
            console.error('Error saving employee:', error);
            if (error.message === 'Persona no encontrada') {
                toast({
                    title: 'Correcto',
                    description: 'No existe una persona con ese CI/RUC',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                });
                setIsPerson(false);
                setValue('name', '');
                setValue('email', '');
                setValue('address', '');
                setValue('phone', '');
                setValue('birthDate', '' as any);
                setValue('gender', '');
            } else {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                });
            }
            setIsDisabled(false);
        } finally {
            setEmployeeCiRuc(ruc);
        }

    };


    return (
        <form className="space-y-4">

            <div className="flex gap-4">
                <div className="flex-1">

                    <FormControl width={{ lg: "100", base: "80%", md: "100%" }} isInvalid={!!errors.ciRuc}>
                        <FormLabel htmlFor="ruc">CI/RUC:</FormLabel>
                        <Flex gap={{ lg: 4, base: 4, md: 1 }}>

                            <Input
                                flex={1 / 3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="ciRuc"
                                {...register('ciRuc')}
                                value={ruc}
                                onChange={(e) => setRuc(e.target.value)}
                            />
                            <Button bg={"gray.700"} colorScheme='white' onClick={isRuc}>
                                Verificar
                            </Button>

                        </Flex>
                        <FormErrorMessage>{getErrorMessage(errors.ciRuc)}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                            <Input
                                isDisabled={isDisabled}
                                id="name"
                                {...register('name')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.name)}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Correo:</FormLabel>
                            <Input
                                isDisabled={isDisabled}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="email"
                                id="email"
                                {...register('email')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.email)}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <FormControl isInvalid={!!errors.address}>
                        <FormLabel htmlFor="address">Dirección:</FormLabel>
                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="address"
                            isDisabled={isDisabled}

                            {...register('address')}

                        />
                        <FormErrorMessage>{getErrorMessage(errors.address)}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.gender}>
                            <FormLabel htmlFor="gender">Sexo:</FormLabel>
                            <Select
                                isDisabled={isDisabled}
                                id="gender"
                                placeholder='Seleccione el sexo'
                                {...register('gender')}
                            >
                                <option value="male">Hombre</option>
                                <option value="female">Mujer</option>
                            </Select>
                            <FormErrorMessage>{getErrorMessage(errors.gender)}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                            <Input
                                isDisabled={isDisabled}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="phone"
                                {...register('phone')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.phone)}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.enterDate}>
                            <FormLabel htmlFor="joinDate">Fecha de Incorporación:</FormLabel>
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="joinDate"
                                {...register('enterDate')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.enterDate)}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.birthDate}>
                            <FormLabel htmlFor="birthdate">Fecha de Nacimiento:</FormLabel>
                            <Input
                                isDisabled={isDisabled}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="birthdate"
                                {...register('birthDate')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.birthDate)}</FormErrorMessage>
                        </FormControl>
                    </div>

                </div>

            </div>
        </form>
    );
};
