'use client'

import { FormEvent, use, useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalCloseButton, ModalFooter, ModalHeader, Select, FormErrorMessage } from '@chakra-ui/react';
import Relative from '@/types/relative';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

interface FormRelativeProps {
    relatives: Relative[];
    setRelatives: (relatives: Relative[]) => void;
    onClose: () => void;
    register: UseFormRegister<Relative>;
    errors: FieldErrors<Relative>;
    handleSubmit: UseFormHandleSubmit<Relative>;
}

export const FormRelative: React.FC<FormRelativeProps> = ({ relatives, setRelatives, onClose, register, errors, handleSubmit }) => {
    const [familyTypes, setFamilyTypes] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchFamilyTypes = async () => {
            const response = await fetch('http://localhost:3000/api/family-types');
            const data = await response.json();
            setFamilyTypes(data.data);
        }
        fetchFamilyTypes();
    }, []);
    const onSubmit = (data: Relative) => {
        console.log(errors)
        setRelatives([...relatives, data]);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Agregar Familiar</ModalHeader>
            <ModalCloseButton />
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                            <Input
                                type="text"
                                id="name"
                                {...register('name')}
                            />
                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <FormControl isInvalid={!!errors.ciRuc}>
                        <FormLabel htmlFor="ci">Número de cédula:</FormLabel>
                        <Input
                            type="text"
                            id="ciRuc"
                            {...register('ciRuc')}
                        />
                        <FormErrorMessage>{errors.ciRuc && errors.ciRuc.message}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.relationshipType}>
                            <FormLabel htmlFor="relationshipType">Parentesco:</FormLabel>
                            <Select
                                id="relationshipType"
                                {...register('relationshipType')}
                            >
                                {familyTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.relationshipType && errors.relationshipType.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.gender}>
                            <FormLabel htmlFor="gender">Género:</FormLabel>
                            <Select
                                id="gender"
                                {...register('gender')}
                            >
                                <option value="female">Femenino</option>
                                <option value="male">Masculino</option>
                            </Select>
                            <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Correo Electrónico:</FormLabel>
                        <Input
                            type="email"
                            id="email"
                            {...register('email')}
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.birthDate}>
                            <FormLabel htmlFor="birthDate">Fecha de Nacimiento:</FormLabel>
                            <Input
                                type="date"
                                id="birthDate"
                                {...register('birthDate')}
                            />
                            <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.phone}>
                            <FormLabel htmlFor="phone">Teléfono:</FormLabel>
                            <Input
                                type="text"
                                id="phone"
                                {...register('phone')}
                            />
                            <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <FormControl isInvalid={!!errors.address}>
                        <FormLabel htmlFor="address">Dirección:</FormLabel>
                        <Input
                            type="text"
                            id="address"
                            {...register('address')}
                        />
                        <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                    </FormControl>
                </div>
            </div>
            <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                    Guardar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
        </form>
    );
}
