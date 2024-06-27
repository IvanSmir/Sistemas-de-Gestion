'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, Button, Divider, Flex, FormControl, FormLabel, Input, Link, Select, Tabs, TabList, TabPanel, TabPanels, Tab, useToast, Wrap, WrapItem, FormErrorMessage } from '@chakra-ui/react';
import { List } from '@/components/relatives/List';
import { useParams, useRouter } from 'next/navigation';
import { getEmployeeId, updateEmployee, deleteEmployee } from '@/utils/detail.http';
import { useAuth } from '@/components/context/AuthProvider';
import Employee from "@/types/employee";
import { EmployeeDetailsList } from './ListPositions';
import { FinanceDetailsList } from './TransactionsList';
import { employeeSchema } from '@/validations/employeeSchema';
import ConfirmDeleteEmployeeModal from './confirmDelete';

const normalizeRUC = (ruc: string) => ruc.replace(/\./g, '');
const denormalizeCi = (ci: string) => ci.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const EmployeeDetails = () => {
    const { id } = useParams();
    const toast = useToast();
    const auth = useAuth();
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Employee>({
        resolver: zodResolver(employeeSchema),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [employeeCiRuc, setEmployeeCiRuc] = useState('');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const onCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmOpen(false);
    };

    const onConfirmDeleteModal = () => {
        setIsDeleteConfirmOpen(false);
        handleDelete();
    };

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
                    setValue('gender', data.person.gender);
                    setValue('address', data.person.address || '');
                    setValue('phone', (data.person.phone ? data.person.phone.slice(4) : '')); // Elimina los 4 primeros dígitos
                    setValue('ciRuc', normalizeRUC(data.person.ciRuc || ''));
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
            toast({
                title: 'Guardando empleado',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            data.phone = '+595' + data.phone.slice(0);

            console.log('data', data);
            data.ciRuc = denormalizeCi(data.ciRuc);
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
            toast.closeAll();
            toast({
                title: 'Error',
                description: 'Failed to save employee.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const onDelete = () => {
        setIsDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const employeeId = typeof id === "string" ? id : "";
            toast({
                title: 'Eliminando empleado',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });

            await deleteEmployee(employeeId, token);
            toast.closeAll();

            toast({
                title: 'Success',
                description: 'Employee deleted successfully!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            router.push('/employees');
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.closeAll();
            toast({
                title: 'Error',
                description: 'Failed to delete employee.',
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
                            <FormControl isInvalid={!!errors.name} mb={4}>
                                <Input
                                    id="name"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                    isReadOnly={!isEditing}
                                    fontWeight="bold"
                                    textAlign={{ lg: "center", base: "center", sm: "left", md: "left" }}
                                    className="input mb-4 disabled-dark:black"
                                    mb={4}
                                />
                                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.gender} mb={4}>
                                <Flex>
                                    <FormLabel fontSize="14px" htmlFor="gender">Sexo:</FormLabel>
                                    <Select
                                        id="gender"
                                        {...register('gender', { required: 'El sexo es obligatorio' })}
                                        isReadOnly={!isEditing}
                                        mb={4}
                                        placeholder='Seleccione el sexo'
                                        isDisabled={!isEditing}
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Femenino</option>
                                    </Select>
                                </Flex>
                                <FormErrorMessage>{errors.gender && errors.gender.message}</FormErrorMessage>
                            </FormControl>
                        </Box>

                        <Box bg={"white"} p={5} borderRadius="md" width="70%">
                            <Flex justifyContent={"end"} mb={4}>
                                {!isEditing && (
                                    <Flex gap={2}>
                                        <Button bg={"red.300"} _hover={{ bgColor: "#c1738e" }} onClick={onDelete}>
                                            Eliminar
                                        </Button>
                                        <Button bg={"gray.300"} onClick={handleEdit}>
                                            Editar
                                        </Button>
                                    </ Flex>

                                )}
                                {isEditing && (
                                    <Flex gap={2}>
                                        <Button
                                            bg={"gray.300"}
                                            type="submit"
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
                                    <FormControl isInvalid={!!errors.ciRuc} mb={4}>
                                        <Flex>
                                            <FormLabel fontSize="14px" htmlFor="ciRuc">Ruc/Ci:</FormLabel>
                                            <Input
                                                id="ciRuc"
                                                {...register('ciRuc', { required: 'El Ruc/Ci es obligatorio' })}
                                                isReadOnly={true}
                                                mb={4}
                                                value={employeeCiRuc}
                                            />
                                            <FormErrorMessage>{errors.ciRuc && errors.ciRuc.message}</FormErrorMessage>
                                        </Flex>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.enterDate} mb={4}>
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
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.birthDate} mb={4}>
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
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl isInvalid={!!errors.address} mb={4}>
                                        <Flex>
                                            <FormLabel fontSize="14px" htmlFor="address">Dirección:</FormLabel>
                                            <Input
                                                id="address"
                                                {...register('address', { required: 'La dirección es obligatoria' })}
                                                isReadOnly={!isEditing}
                                            />
                                            <FormErrorMessage>{errors.address && errors.address.message}</FormErrorMessage>
                                        </Flex>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.email} mb={4}>
                                        <Flex>
                                            <FormLabel fontSize="14px" htmlFor="email">Correo:</FormLabel>
                                            <Input
                                                id="email"
                                                {...register('email', { required: 'El correo es obligatorio' })}
                                                isReadOnly={!isEditing}
                                                mb={4}
                                            />
                                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                        </Flex>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.phone} mb={4}>
                                        <Flex>
                                            <FormLabel fontSize="14px" htmlFor="phone">Teléfono:</FormLabel>
                                            <Input
                                                id="phone"
                                                {...register('phone', { required: 'El teléfono es obligatorio' })}
                                                isReadOnly={!isEditing}
                                            />
                                            <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                                        </Flex>
                                    </FormControl>
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
            <ConfirmDeleteEmployeeModal
                isOpen={isDeleteConfirmOpen}
                onClose={onCloseDeleteConfirmModal}
                onConfirm={onConfirmDeleteModal}
            />
        </Box>
    );
}
