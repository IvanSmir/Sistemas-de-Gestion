'use client'

import { FormEvent, use, useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalCloseButton, ModalFooter, ModalHeader, Select, FormErrorMessage, useToast } from '@chakra-ui/react';
import Relative from '@/types/relative';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useAuth } from '@/components/context/AuthProvider';
import { getPerson } from '@/utils/person.http';

const ApiUrl = process.env.NEXT_PUBLIC_API_URL + '/family-types';

const normalizeRUC = (ruc: string) => ruc.replace(/\./g, '');
const denormalizeCi = (ci: string) => ci.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

interface FormRelativeProps {
    relatives: Relative[];
    setRelatives: (relatives: Relative[]) => void;
    onClose: () => void;
    register: UseFormRegister<Relative>;
    errors: FieldErrors<Relative>;
    handleSubmit: UseFormHandleSubmit<Relative>;
    setValue: UseFormSetValue<Relative>;
    employeeCiRuc: string;
}

const cedulaRegex = /^\d{6,8}$/;
const rucRegex = /^\d{1,8}-\d$/;

export const FormRelative: React.FC<FormRelativeProps> = ({ relatives, setRelatives, onClose, register, errors, handleSubmit, setValue, employeeCiRuc }) => {
    const [familyTypes, setFamilyTypes] = useState<{ id: string, name: string }[]>([]);
    const [isPerson, setIsPerson] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [ruc, setRuc] = useState('');
    const auth = useAuth();
    const toast = useToast();

    useEffect(() => {
        const fetchFamilyTypes = async () => {
            const response = await fetch(ApiUrl);
            const data = await response.json();
            setFamilyTypes(data.data);
        }
        fetchFamilyTypes();
    }, []);

    const onSubmit = (data: Relative) => {
        if (!data.ciRuc.includes('-')) {
            data.ciRuc = denormalizeCi(data.ciRuc);
        }
        setRelatives([...relatives, { ...data, isNew: !isPerson }]);
        console.log('data', data);
        console.log('relatives', relatives);
        onClose();
    };

    const isRuc = async () => {

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
            if (relative.ciRuc.includes('-')) {
                return relative.ciRuc === ruc;
            }
            return normalizeRUC(relative.ciRuc) === normalizeRUC(ruc);
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

            let rucToCheck = ruc;
            if (!ruc.includes('-')) {
                rucToCheck = denormalizeCi(ruc);
                setRuc(denormalizeCi(ruc));
            }

            console.log('ruc', ruc);
            const { user } = auth;
            const token = user?.token || '';
            const personResponse = await getPerson(rucToCheck, token);

            toast({
                title: 'Info',
                description: 'Ya existe una persona con ese CI/RUC',
                status: 'info',
                duration: 1000,
                isClosable: true,
            });
            setIsPerson(true);
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
                setIsPerson(false);
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
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Agregar Familiar</ModalHeader>
            <ModalCloseButton />
            <div className="flex gap-4">
                <div className="flex-1">
                    <FormControl isInvalid={!!errors.ciRuc}>
                        <FormLabel htmlFor="ruc">CI/RUC:</FormLabel>
                        <div className="flex gap-4">
                            <Input
                                type="text"
                                id="ciRuc"
                                {...register('ciRuc')}
                                value={ruc}
                                onChange={(e) => setRuc(e.target.value)}
                            />
                            <Button onClick={isRuc}>
                                Verificar
                            </Button>
                        </div>
                        <FormErrorMessage>{errors.ciRuc && errors.ciRuc.message}</FormErrorMessage>
                    </FormControl>
                    <div className="flex gap-4">
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
                    </div>
                    <FormControl isInvalid={!!errors.familyTypeId}>
                        <FormLabel htmlFor="relationshipType">Parentesco:</FormLabel>
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
                    <FormControl isInvalid={!!errors.gender}>
                        <FormLabel htmlFor="gender">Género:</FormLabel>
                        <Select
                            id="gender"
                            isDisabled={isDisabled}
                            {...register('gender')}
                        >
                            <option value="female">Femenino</option>
                            <option value="male">Masculino</option>
                        </Select>
                        <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Correo Electrónico:</FormLabel>
                        <Input
                            type="email"
                            id="email"
                            isDisabled={isDisabled}
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
                                isDisabled={isDisabled}
                                {...register('birthDate')}
                            />
                            <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
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
                    </div>
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
