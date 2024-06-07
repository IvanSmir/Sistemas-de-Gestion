'use client'
import React, { useCallback, useEffect, useState } from "react";
import { Text, FormControl, Input, FormLabel, Select, Button, ModalOverlay, ModalContent, Modal, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage, useToast } from '@chakra-ui/react';
import { updateFamilyMember, getFamilyTypes } from "@/utils/family.http";
import { useAuth } from "@/components/context/AuthProvider";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from "next/navigation";
import { relativeSchema } from "@/validations/relativeSchema";
import Relative from "@/types/relative";

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
    gender: string;
}

interface FamilyMember extends Relative {
    id: string;
    familyType: {
        name: string;
        id: string;
    };
    person: Person;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    familyMember: FamilyMember;
    fetchDataFamily: () => void;
}

const normalizeRUC = (ruc: string) => ruc.replace(/\./g, '');
const denormalizeCi = (ci: string) => ci.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const EditForm: React.FC<ModalProps> = ({ isOpen, onClose, familyMember, fetchDataFamily }) => {
    const toast = useToast();
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const [familyTypes, setFamilyTypes] = useState<FamilyTypes[]>([]);
    const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm<Relative>({ resolver: zodResolver(relativeSchema) });

    const fetchData = useCallback(async () => {
        const { user } = auth;
        const token = user?.token || '';
        const familyTypesResponse = await getFamilyTypes(token);
        setFamilyTypes(familyTypesResponse.data);
    }, [auth]);

    useEffect(() => {
        fetchData();
        setValue('name', familyMember.person.name);
        setValue('email', familyMember.person.email);
        setValue('address', familyMember.person.address);
        setValue('phone', familyMember.person.phone);
        setValue('birthDate', familyMember.person.birthDate.split('T')[0]);
        setValue('gender', familyMember.person.gender);
        setValue('familyTypeId', familyMember.familyType.id);
        setValue('ciRuc', normalizeRUC(familyMember.person.ciRuc));
    }, [setValue, fetchData, familyMember]);

    const onSubmit: SubmitHandler<Relative> = async (data) => {
        data.ciRuc = denormalizeCi(data.ciRuc);
        const updateData = {
            ...data,
            familyTypeId: data.familyTypeId,
        };

        try {
            const { user } = auth;
            const token = user?.token || '';
            toast({
                title: 'Guardando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            await updateFamilyMember(familyMember.id, updateData, token);
            toast.closeAll();
            toast({
                title: 'Guardado',
                description: 'Familiar actualizado con éxito',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
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
            setError(err.message);
        }
    };

    const handleButtonClick = async () => {
        const isValid = await trigger();
        console.log('isValid', isValid);
        console.log('errors', errors);
        if (isValid) {
            handleSubmit(onSubmit)();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Familiar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                            <Input type="text" id="name" {...register('name')} />
                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.gender}>
                            <FormLabel htmlFor="gender">Género:</FormLabel>
                            <Select id="gender" {...register('gender')}>
                                <option value="male">Hombre</option>
                                <option value="female">Mujer</option>
                            </Select>
                            <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.birthDate}>
                            <FormLabel htmlFor="birthDate">Fecha de nacimiento:</FormLabel>
                            <Input type="date" id="birthDate" {...register('birthDate')} />
                            <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Correo electrónico:</FormLabel>
                            <Input type="email" id="email" {...register('email')} />
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                            <Input type="text" id="phone" {...register('phone')} />
                            <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.address}>
                            <FormLabel htmlFor="address">Dirección:</FormLabel>
                            <Input type="text" id="address" {...register('address')} />
                            <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.familyTypeId}>
                            <FormLabel htmlFor="familyTypeId">Tipo de familia:</FormLabel>
                            <Select id="familyTypeId" {...register('familyTypeId')}>
                                {familyTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.familyTypeId && errors.familyTypeId.message}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} onClick={handleButtonClick} display="block" mx="auto">Guardar</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
