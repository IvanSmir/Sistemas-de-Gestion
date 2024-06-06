'use client'
import React, { useEffect, useState } from 'react';
import { useForm, UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import { Avatar, Box, Button, Divider, Flex, FormControl, FormLabel, Input, Link, Select, Tabs, TabList, TabPanel, TabPanels, Tab, useToast, Wrap, WrapItem, FormErrorMessage } from '@chakra-ui/react';
import { List } from '@/components/relatives/List';
import { useParams, useRouter } from 'next/navigation';
import { getEmployeeId, updateEmployee } from '@/utils/detail.http';
import { useAuth } from '@/components/context/AuthProvider';
import Employee from "@/types/employee";
import { EmployeeDetailsList } from './ListPositions';
import { FinanceDetailsList } from './TransactionsList';

export const EmployeeDetails = () => {
    const { id } = useParams();
    const toast = useToast();
    const auth = useAuth();
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors, isDirty, isValid } } = useForm<Employee>({
        mode: 'onChange',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [employeeCiRuc, setEmployeeCiRuc] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const { user } = auth;
                if (user?.token) {
                    const token = user.token;
                    const employeeId = typeof id === "string" ? id : "";
                    const data = await getEmployeeId(employeeId, token);
                    setValue('name', data.person.name || '');
                    setValue('email', data.person.email || '');
                    setValue('gender', data.person.gender === 'male' ? 'Masculino' : 'Femenino');
                    setValue('address', data.person.address || '');
                    setValue('phone', data.person.phone || '');
                    setValue('ciRuc', data.person.ciRuc || '');
                    setEmployeeCiRuc(data.person.ciRuc);
                    setValue('enterDate', data.enterDate ? data.enterDate.split('T')[0] : '');
                    setValue('birthDate', data.person.birthDate ? data.person.birthDate.split('T')[0] : '');
                } else {
                    throw new Error('Token is missing');
                }
            } catch (error) {
                const err = error as Error;
                toast.closeAll();
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchEmployee();
    }, [id, toast, auth, setValue]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleCancel = () => {
        setIsEditing(false);
    }

    const handleBack = () => {
        router.back();
    }

    const handleSave = async (data: Employee) => {
        toast.closeAll();

        try {
            const { user } = auth;
            const token = user?.token || '';
            const employeeId = typeof id === "string" ? id : "";
            data.gender = data.gender === 'Masculino' ? 'male' : 'female';
            toast({
                title: 'Guardando empleado',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            await updateEmployee(employeeId, data, token);
            toast.closeAll();

            toast({
                title: 'Success',
                description: 'Employee saved successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving employee:', error);
            toast({
                title: 'Error',
                description: 'Failed to save employee.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box bg={"gray.200"} mb={6}>
            <Flex>
                <Link href="/employees">
                    <Button onClick={handleBack}>
                        Volver
                    </Button>
                </Link>

            </Flex>
            <Flex bg={"gray.200"} p='10'>
                <form onSubmit={handleSubmit(handleSave)}>

                    <Flex direction={{ base: "column", md: "row" }} gap={4}>
                        <Box bg={"white"} p={5} borderRadius="md" width="30%">
                            <Box display={"flex"} justifyContent={"center"}>
                                <Wrap>
                                    <WrapItem>
                                        <Avatar size='3xl' />
                                    </WrapItem>
                                </Wrap>
                            </Box>
                            <Input
                                id="name"
                                {...register('name', { required: 'El nombre es obligatorio' })}
                                isReadOnly={!isEditing}
                                fontWeight="bold"
                                textAlign={{ lg: "center", base: "center", sm: "left", md: "left" }}
                                className="input mb-4 disabled-dark:black"
                                mb={4}
                            />
                            <Flex>
                                <FormLabel fontSize="14px" htmlFor="gender">Sexo:</FormLabel>
                                <Select
                                    id="gender"
                                    {...register('gender', { required: 'El sexo es obligatorio' })}
                                    isReadOnly={!isEditing}
                                    mb={4}
                                    placeholder='Seleccione el sexo'
                                >
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </Select>
                            </Flex>
                            <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
                        </Box>

                        <Box bg={"white"} p={5} borderRadius="md" width="70%">
                            <Flex justifyContent={"end"} mb={4}>
                                {!isEditing && (
                                    <Button bg={"gray.300"} onClick={handleEdit}>
                                        Editar
                                    </Button>
                                )}
                                {isEditing && (
                                    <Flex gap={2}>
                                        <Button
                                            bg={"gray.300"}
                                            onClick={handleSubmit(handleSave)}
                                            isDisabled={!isDirty || !isValid}
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            bg={"gray.100"}
                                            onClick={handleCancel}>
                                            Cancelar
                                        </Button>
                                    </Flex>
                                )}
                            </Flex>
                            <Flex justifyContent={"space-evenly"} gap={4} mb={4}>
                                <Box mb={8}>
                                    <Flex>
                                        <FormLabel fontSize="14px" htmlFor="ciRuc">Ruc/Ci:</FormLabel>
                                        <Input
                                            id="ciRuc"
                                            {...register('ciRuc', { required: 'El Ruc/Ci es obligatorio' })}
                                            isReadOnly={true}
                                            mb={4}
                                        />
                                        <FormErrorMessage>{errors.ciRuc && errors.ciRuc.message}</FormErrorMessage>
                                    </Flex>
                                    <Flex>
                                        <FormLabel fontSize="14px" htmlFor="enterDate">Fecha Ingreso:</FormLabel>
                                        <Input
                                            type="date"
                                            id="enterDate"
                                            {...register('enterDate', { required: 'La fecha de ingreso es obligatoria' })}
                                            isReadOnly={!isEditing}
                                        />
                                        <FormErrorMessage>{errors.enterDate && errors.enterDate.message}</FormErrorMessage>
                                    </Flex>
                                    <Flex>
                                        <FormLabel fontSize="14px" htmlFor="birthDate">Fecha Nacimiento:</FormLabel>
                                        <Input
                                            type="date"
                                            id="birthDate"
                                            {...register('birthDate', { required: 'La fecha de nacimiento es obligatoria' })}
                                            isReadOnly={!isEditing}
                                        />
                                        <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
                                    </Flex>
                                </Box>
                                <Box>
                                    <Flex>
                                        <FormLabel fontSize="14px" htmlFor="address">Dirección:</FormLabel>
                                        <Input
                                            id="address"
                                            {...register('address', { required: 'La dirección es obligatoria' })}
                                            isReadOnly={!isEditing}
                                        />
                                        <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                                    </Flex>
                                    <Flex marginTop={4}>
                                        <FormLabel fontSize="14px" htmlFor="email">Correo:</FormLabel>
                                        <Input
                                            id="email"
                                            {...register('email', { required: 'El correo es obligatorio' })}
                                            isReadOnly={!isEditing}
                                            mb={4}
                                        />
                                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                    </Flex>
                                    <Flex>
                                        <FormLabel fontSize="14px" htmlFor="phone">Teléfono:</FormLabel>
                                        <Input
                                            id="phone"
                                            {...register('phone', { required: 'El teléfono es obligatorio' })}
                                            isReadOnly={!isEditing}
                                        />
                                        <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                                    </Flex>
                                </Box>
                            </Flex>
                           
                        </Box>

                    </Flex>
                </form>
            </Flex>
            <Divider orientation='horizontal' w='75%' mb={4} />
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList ml={4}>
                    <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Familiares</Tab>
                    <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Cargos</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <List employeeCiRuc={employeeCiRuc} />
                    </TabPanel>
                    <TabPanel>
                    <EmployeeDetailsList />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}
