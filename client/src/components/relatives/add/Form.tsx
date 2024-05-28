'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Text, FormControl, Input, FormLabel, Select, Button, Flex, Box, ModalOverlay, ModalContent, Modal, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage } from '@chakra-ui/react'
import { createFamilyMember, getFamilyTypes } from "@/utils/family.http";
import { useAuth } from "@/components/context/AuthProvider";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { relative } from "path";
import { relativeSchema } from "@/validations/relativeSchema";
import { useParams } from "next/navigation";
import { Decipher } from "crypto";
import Relative from "@/types/relative";
const ApiUrl = process.env.NEXT_PUBLIC_API_URL + '/family-types';

interface FamilyTypes {
    id: string;
    name: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const Form: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);

    const auth = useAuth();
    const [familyTypes, setFamilyTypes] = useState<FamilyTypes[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<Relative>({ resolver: zodResolver(relativeSchema) });

    const [formData, setFormData] = useState<Relative>({

        name: "",
        address: "",
        phone: "",
        email: "",
        ciRuc: "",
        birthDate: new Date(),
        gender: "",
        familyTypeId: ""

    });


    const onSubmit = async (relative: Relative) => {

        console.log(formData);
        try {
            const { user } = auth;
            const token = user?.token || '';
            console.log('relative', { ...relative });
            const data = await createFamilyMember({ ...relative }, id as string, token);
            setFormData(data.data);
        } catch (err: any) {
            setError(err.message);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const { user } = auth;
            const token = user?.token || '';
            const familyTypesResponse = await getFamilyTypes(token);
            console.log('familyTypesResponse', familyTypesResponse);
            setFamilyTypes(familyTypesResponse.data);
        };
        fetchData();
    }, [auth]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Agregar Familiar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex justify="center" align="center" minH="90vh">
                        <Box bg="white" p={5} borderRadius="md" boxShadow="md" >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                                    <FormControl isInvalid={!!errors.name} flex="1">
                                        <FormLabel htmlFor="name">Nombre:</FormLabel>
                                        <Input
                                            type="text"
                                            id="name"
                                            {...register('name')}
                                        />
                                        {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}

                                    </FormControl>
                                    <FormControl isInvalid={!!errors.gender} flex="1">
                                        <FormLabel htmlFor="gender">Genero:</FormLabel>
                                        <Select
                                            id="gender"
                                            {...register('gender')}
                                        >
                                            <option value="male">Hombre</option>
                                            <option value="female">Mujer</option>
                                        </Select>
                                        {errors.gender && <FormErrorMessage>{errors.gender.message}</FormErrorMessage>}
                                    </FormControl>
                                </Flex>
                                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                                    <FormControl isInvalid={!!errors.ciRuc} flex="1">
                                        <FormLabel htmlFor="ciRuc">Número de cédula:</FormLabel>
                                        <Input
                                            type="text"
                                            id="ciRuc"
                                            {...register('ciRuc')}
                                        />
                                        {errors.ciRuc && <FormErrorMessage>{errors.ciRuc.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.birthDate} flex="1">
                                        <FormLabel htmlFor="birthDate">Fecha de nacimiento:</FormLabel>
                                        <Input
                                            type="date"
                                            id="birthDate"
                                            {...register('birthDate')}
                                        />
                                        {errors.birthDate && <FormErrorMessage>{errors.birthDate.message}</FormErrorMessage>}
                                    </FormControl>
                                </Flex>
                                <FormControl isInvalid={!!errors.email} >
                                    <FormLabel htmlFor="email">Correo electrónico:</FormLabel>
                                    <Input
                                        type="email"
                                        id="email"
                                        {...register('email')}
                                    />
                                    {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                                </FormControl >
                                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                                    <FormControl isInvalid={!!errors.familyTypeId} flex="1">
                                        <FormLabel htmlFor="familyTypeId">Tipo de familia:</FormLabel>
                                        <Select
                                            id="familyTypeId"
                                            {...register('familyTypeId')}
                                        >
                                            {familyTypes.map((type => (

                                                <option key={type.id} value={type.id}>{type.name}</option>

                                            )))
                                            }
                                        </Select>
                                        {errors.familyTypeId && <FormErrorMessage>{errors.familyTypeId.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.phone} flex="1">
                                        <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                                        <Input
                                            type="text"
                                            id="phone"
                                            {...register('phone')}
                                        />
                                        {errors.phone && <FormErrorMessage>{errors.phone.message}</FormErrorMessage>}
                                    </FormControl>
                                </Flex>
                                <Flex direction={{ base: "column" }} gap={6}>
                                    <FormControl isInvalid={!!errors.address} flex="1">
                                        <FormLabel htmlFor="address">Dirección:</FormLabel>
                                        <Input
                                            type="text"
                                            id="address"
                                            {...register('address')}
                                        />
                                        {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
                                    </FormControl>
                                    <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type='submit' display="block" mx="auto">Guardar</Button>
                                </Flex>
                            </form>
                        </Box>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>

    );
}


