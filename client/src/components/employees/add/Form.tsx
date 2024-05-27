'use client'
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import Image from "next/image";
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage, Flex } from '@chakra-ui/react';
import Employee from "@/types/employee";
import { getPerson } from '@/utils/person.http';
import { useAuth } from '@/components/context/AuthProvider';
import { useRouter } from 'next/navigation';
interface FormEmployeeProps {
    register: UseFormRegister<Employee>;
    errors: FieldErrors<Employee>;
}

export const FormEmployee: React.FC<FormEmployeeProps> = ({ register, errors }) => {
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
            const employeeResponse = await getPerson(ruc, token);

            alert('Una persona con ese CI/RUC existe');
            console.log(employeeResponse);
            if (employeeResponse.isEmployee) {
                router.push(`/employees/${employeeResponse.idEmployee}`);
            }
            else {
                setIsDisabled(false);
            }

        } catch (error) {
            console.error('Error saving employee:', error);
            alert('no se encontro la persona con ese CI/RUC');
            setIsDisabled(false);
        }

    };
    return (
        <form className="space-y-4">

            <div className="flex gap-4">
                <div className="flex-1">
                    <FormControl width={{ lg: "100", base: "80%", md: "100%" }} isInvalid={!!errors.ciRuc}>
                        <FormLabel htmlFor="ruc">CI/RUC:</FormLabel>
                        <Flex justifyContent={"space-between"} gap={{ lg: 4, base: 4, md: 1 }}>

                            <Input
                                flex={1}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="ciRuc"
                                {...register('ciRuc')}
                                value={ruc}
                                onChange={(e) => setRuc(e.target.value)}
                            />
                            <Button flex={1 / 2} onClick={isRuc}>
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
                                isDisabled={isDisabled}
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
                                isDisabled={isDisabled}
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
