'use client'
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Text, FormControl, Input, FormLabel, Select, Button, Flex, Box, ModalOverlay, ModalContent, Modal, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage, useToast } from '@chakra-ui/react'
import { createFamilyMember, getFamilyTypes } from "@/utils/family.http";
import { useAuth } from "@/components/context/AuthProvider";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from "next/navigation";
import Relative from "@/types/relative";
import { relativeSchema } from "@/validations/relativeSchema";
import { getPerson } from "@/utils/person.http";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL + '/family-types';

interface FamilyTypes {
    id: string;
    name: string;
}


interface Person {
    ciRuc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
}

interface FamilyMember extends Relative {
    id: string;
    familyTypeId: string;
    person: Person;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeCiRuc: string;
    relatives: FamilyMember[];
    fetchDataFamily: () => void;
}


const cedulaRegex = /^\d{6,8}$/;
const rucRegex = /^\d{1,8}-\d$/;

const normalizeRUC = (ruc: string) => ruc.replace(/\./g, '');
const denormalizeCi = (ci: string) => ci.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const Form: React.FC<ModalProps> = ({ isOpen, onClose, employeeCiRuc, relatives, fetchDataFamily }) => {
    const toast = useToast();
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const [familyTypes, setFamilyTypes] = useState<FamilyTypes[]>([]);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Relative>({ resolver: zodResolver(relativeSchema) });
    const [ruc, setRuc] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isPerson, setIsPerson] = useState(false);

    const fetchData = useCallback(async () => {
        const { user } = auth;
        const token = user?.token || '';
        const familyTypesResponse = await getFamilyTypes(token);
        setFamilyTypes(familyTypesResponse.data);
    }, [auth]);

    const onSubmit = async (relative: Relative) => {
        console.log(FormData);
        try {

            const { user } = auth;
            const token = user?.token || '';
            console.log('relative', { ...relative });
            setIsDisabled(true);
            toast({
                title: 'Guardando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            relative.ciRuc = relative.ciRuc.includes('-') ? relative.ciRuc : denormalizeCi(relative.ciRuc);
            console.log('relative', { ...relative });
            const data = await createFamilyMember({ ...relative, isNew: !isPerson }, id as string, token);
            setIsDisabled(false);
            toast.closeAll();
            toast({
                title: 'Guardado',
                description: 'Familiar agregado con éxito',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setValue('ciRuc', '');
            setValue('name', '');
            setValue('email', '');
            setValue('address', '');
            setValue('phone', '');
            setValue('birthDate', '' as any);
            setValue('gender', '');
            setValue('isNew', true);
            fetchDataFamily();
            onClose();
        } catch (err: any) {
            toast.closeAll();
            toast({
                title: 'Error',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsDisabled(false);
            setError(err.message);
        }
    };


    useEffect(() => {
        setRuc('');
        fetchData();
        setValue('ciRuc', '');
        setValue('name', '');
        setValue('email', '');
        setValue('address', '');
        setValue('phone', '');
        setValue('birthDate', '' as any);
        setValue('gender', '');
        setValue('isNew', true);
        setIsPerson(false);
    }, [auth, setValue, fetchData]);

    const isRuc = async () => {
        console.log('ruc', ruc);
        console.log('employeeCiRuc', employeeCiRuc);
        console.log('relatives', relatives);
        if (ruc.trim() === '') {
            toast({
                title: 'Info',
                description: 'El CI/RUC no puede estar vacío',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            return;
        }

        if (!cedulaRegex.test(ruc) && !rucRegex.test(ruc)) {
            toast({
                title: 'Info',
                description: 'El CI/RUC debe ser un número de cédula o RUC válido',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            return;
        }

        if (employeeCiRuc === ruc) {
            toast({
                title: 'Info',
                description: 'La persona con ese CI/RUC es el empleado',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            onClose();
            return;
        }

        const isOnTheList = relatives.some((relative) => {
            console.log('relative', relative);
            if (relative.person.ciRuc.includes('-')) {
                return relative.person.ciRuc === ruc;
            }
            return normalizeRUC(relative.person.ciRuc) === normalizeRUC(ruc);
        });




        if (isOnTheList) {
            toast({
                title: 'Info',
                description: 'Una persona con ese CI/RUC ya existe en la lista',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            onClose();
            return;
        }
        try {



            const { user } = auth;
            const token = user?.token || '';
            const personResponse = await getPerson(ruc.includes('-') ? ruc : denormalizeCi(ruc), token);

            toast({
                title: 'Info',
                description: 'Ya existe una persona con ese CI/RUC',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            setIsDisabled(true);
            setValue('name', personResponse.name);
            setValue('email', personResponse.email);
            setValue('address', personResponse.address);
            setValue('phone', personResponse.phone);
            setValue('birthDate', personResponse.birthDate.split('T')[0]);
            setValue('gender', personResponse.gender);
            setValue('isNew', false);
            setIsPerson(true);

        } catch (error: any) {
            if (error.message === 'Persona no encontrada') {
                toast({
                    title: 'Correcto',
                    description: 'No existe una persona con ese CI/RUC',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                });
                setValue('name', '');
                setValue('email', '');
                setValue('address', '');
                setValue('phone', '');
                setValue('birthDate', '' as any);
                setValue('gender', '');
                setValue('isNew', true);
                setIsPerson(false);
            } else {
                console.error('Error verifying CI/RUC:', error);
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                });
            }
            setIsDisabled(false);

        }
        finally {
            setRuc(ruc);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Agregar Familiar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={!!errors.ciRuc}>
                            <FormLabel htmlFor="ruc">CI/RUC:</FormLabel>
                            <Flex gap={4}>
                                <Input
                                    type="text"
                                    id="ciRuc"
                                    {...register('ciRuc')}
                                    value={ruc}
                                    onChange={(e) => setRuc(e.target.value)}
                                />
                                <Button bg={"gray.700"} colorScheme='white' onClick={isRuc}>Verificar</Button>
                            </Flex>
                            <FormErrorMessage>{errors.ciRuc && errors.ciRuc.message}</FormErrorMessage>
                        </FormControl>
                        <Flex>

                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel htmlFor="name">Nombre:</FormLabel>
                                <Input
                                    type="text"
                                    id="name"
                                    isDisabled={isDisabled}
                                    {...register('name')}
                                />
                                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.gender}>
                                <FormLabel htmlFor="gender">Genero:</FormLabel>
                                <Select
                                    id="gender"
                                    isDisabled={isDisabled}
                                    {...register('gender')}
                                >
                                    <option value="male">Hombre</option>
                                    <option value="female">Mujer</option>
                                </Select>
                                <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>

                            </FormControl>
                        </Flex>
                        <FormControl isInvalid={!!errors.birthDate}>
                            <FormLabel htmlFor="birthDate">Fecha de nacimiento:</FormLabel>
                            <Input
                                type="date"
                                id="birthDate"
                                isDisabled={isDisabled}
                                {...register('birthDate')}
                            />
                            <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
                        </FormControl>
                        <Flex>

                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel htmlFor="email">Correo electrónico:</FormLabel>
                                <Input
                                    type="email"
                                    id="email"
                                    isDisabled={isDisabled}
                                    {...register('email')}
                                />
                                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.phone}>
                                <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                                <Input
                                    type="text"
                                    id="phone"
                                    isDisabled={isDisabled}
                                    {...register('phone')}
                                />
                                <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                            </FormControl>
                        </Flex>
                        <FormControl isInvalid={!!errors.address}>
                            <FormLabel htmlFor="address">Dirección:</FormLabel>
                            <Input
                                type="text"
                                id="address"
                                isDisabled={isDisabled}
                                {...register('address')}
                            />
                            <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                        </FormControl>


                        <FormControl isInvalid={!!errors.familyTypeId}>
                            <FormLabel htmlFor="familyTypeId">Tipo de familia:</FormLabel>
                            <Select
                                id="familyTypeId"
                                {...register('familyTypeId')}
                            >
                                {familyTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.familyTypeId && errors.familyTypeId.message}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type='submit' display="block" mx="auto">Guardar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
