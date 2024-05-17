'use client'
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import Image from "next/image";
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import Employee from "@/types/employee";

interface FormEmployeeProps {
    employee: Employee;
    setEmployee: React.Dispatch<React.SetStateAction<Employee>>;
    register: UseFormRegister<Employee>;
    handleSubmit: UseFormHandleSubmit<Employee>;
    errors: FieldErrors<Employee>;
}

export const FormEmployee: React.FC<FormEmployeeProps> = ({ employee, setEmployee, register, handleSubmit, errors }) => {
    const getErrorMessage = (error: any) => {
        if (error && typeof error.message === 'string') {
            return error.message;
        }
        return '';
    };

    return (
        <form onSubmit={handleSubmit((data) => setEmployee(data))} className="space-y-4">

            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                            <Input
                                id="name"
                                {...register('name')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.name)}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Correo:</FormLabel>
                            <Input
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

                            {...register('address')}

                        />
                        <FormErrorMessage>{getErrorMessage(errors.address)}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.gender}>
                            <FormLabel htmlFor="gender">Sexo:</FormLabel>
                            <Select
                                id="gender"
                                placeholder='Seleccione el sexo'
                                {...register('gender')}
                            >
                                <option value="male">Hombre</option>
                                <option value="female">Mujer</option>
                            </Select>
                            <FormErrorMessage>{getErrorMessage(errors.gender)}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.ruc}>
                            <FormLabel htmlFor="ruc">RUC:</FormLabel>
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="ruc"
                                {...register('ruc')}
                            />
                            <FormErrorMessage>{getErrorMessage(errors.ruc)}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.joinDate}>
                            <FormLabel htmlFor="joinDate">Fecha de Incorporación:</FormLabel>
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="joinDate"
                                {...register('joinDate')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.joinDate)}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.birthdate}>
                            <FormLabel htmlFor="birthdate">Fecha de Nacimiento:</FormLabel>
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="birthdate"
                                {...register('birthdate')}

                            />
                            <FormErrorMessage>{getErrorMessage(errors.birthdate)}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <FormControl isInvalid={!!errors.phone}>
                        <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="phone"
                            {...register('phone')}

                        />
                        <FormErrorMessage>{getErrorMessage(errors.phone)}</FormErrorMessage>
                    </FormControl>
                </div>
                <div className="w-1/4 gap-4">
                    <FormControl isInvalid={!!errors.image}>
                        <FormLabel htmlFor="image">Foto de Perfil:</FormLabel>
                        <div className="flex flex-col h-56 justify-center">
                            <div className="flex justify-center">
                                <Image
                                    className="object-cover bg-no-repeat"
                                    src="/subir.png"
                                    alt="subir.png"
                                    width={128}
                                    height={128}
                                />
                            </div>
                            <Input
                                type="text"
                                id="image"
                                {...register('image')}

                            />
                            <Button mt={4} colorScheme='gray'>Subir Imagen</Button>
                        </div>
                        <FormErrorMessage>{getErrorMessage(errors.image)}</FormErrorMessage>
                    </FormControl>
                </div>
            </div>
        </form>
    );
};
