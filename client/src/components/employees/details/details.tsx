'use client'
import { PhoneIcon } from '@chakra-ui/icons'
import { AbsoluteCenter, As, AspectRatio, Avatar, Box, Button, Center, Container, Divider, Fade, Flex, FormControl, FormLabel, Grid, GridItem, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { List } from '@/components/relatives/List'
import router from 'next/router'
import { useParams, useRouter } from 'next/navigation'
import { getEmployeeId, updateEmployee } from '@/utils/detail.http'
import { useAuth } from '@/components/context/AuthProvider'


export const EmployeeDetails = () => {
    const { id } = useParams();
    const toast = useToast();
    const auth = useAuth();
    console.log(id)


    const [formData, setFormData] = useState(
        {
            name: "",
            email: "",
            image: "",
            gender: "",
            direction: "",
            phone: "",
            ruc: "",
            joinDate: new Date(),
            birthDate: new Date(),
            cargo: "",
            detalle: "",
            sueldoBase: ""
        }
    );

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {

        const fetchEmployee = async () => {
            try {
                const { user } = auth;
                if (user?.token) {
                    const token = user.token;
                    const employeeId = typeof id === "string" ? id : ""
                    const data = await getEmployeeId(employeeId, token);
                    console.log('data', data);
                    setFormData({
                        name: data.person.name || "",
                        email: data.person.email || "",
                        image: data.person.image || "",
                        gender: data.person.gender === 'male' ? 'Masculino' : 'Femenino',
                        direction: data.person.address || "",
                        phone: data.person.phone || "",
                        ruc: data.person.ciRuc || "",
                        joinDate: data.enterDate ? new Date(data.enterDate) : new Date(),
                        birthDate: data.person.birthDate ? new Date(data.person.birthDate) : new Date(),
                        cargo: data.cargo || "",
                        detalle: data.person.detalle || "",
                        sueldoBase: data.person.sueldoBase || ""
                    });
                } else {
                    throw new Error('Token is missing');
                }
            } catch (error) {
                const err = error as Error;
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
    }, [id, toast, auth]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const handleEdit = () => {
        setIsEditing(true);
    }
    const handleCancel = () => {
        setIsEditing(false);
    }
    const handleBack = () => {
        router.back()
    }


    const handleSave = async () => {
        const employeeData = {
            ...formData,
        };
        console.log('employeeData', employeeData);

        try {
            const { user } = auth;
            const token = user?.token || '';
            const employeeId = typeof id === "string" ? id : ""
            const employeeResponse = await updateEmployee(employeeId, employeeData, token);
            alert('Employee saved successfully!');
            router.push('/employees');
            console.log(employeeResponse);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee.');
        }
    };
    return (
        <>
            <Box p='10'>
                <Flex>
                    <Link href="/employees">
                        <Button
                        >
                            Volver
                        </Button>
                    </Link>
                    <Button
                        onClick={handleEdit}
                    >
                        Editar
                    </Button>
                    <Button
                    >
                        Guardar
                    </Button>
                    <Button
                        onClick={handleCancel}
                        disabled={!isEditing}
                    >
                        Cancelar
                    </Button>
                </Flex>
                <Flex p='10'>
                    <form>
                        <FormControl >
                            <Flex direction={{ base: "column", md: "row" }} >
                                <Box p='10'>

                                    <Wrap>
                                        <WrapItem>
                                            <Avatar size='3xl' />
                                        </WrapItem>
                                    </Wrap>

                                </Box>

                                <Box flex='2' >
                                    <Flex  >
                                        <Box mb={8}>
                                            <FormLabel htmlFor="ruc">Ruc/Ci:</FormLabel>
                                            <Input

                                                value={formData.ruc !== undefined ? formData.ruc : ''}
                                                readOnly={!isEditing}
                                                mb={4}
                                                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                                            />
                                            <FormLabel htmlFor="gender">Sexo:</FormLabel>
                                            <Input

                                                value={formData.gender !== undefined ? formData.gender : ''}
                                                readOnly={!isEditing}
                                                mb={4}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            />
                                            <FormLabel htmlFor="joinDate">Fecha Ingreso:</FormLabel>
                                            <Input
                                                type="date"
                                                value={formData.joinDate ? formData.joinDate.toISOString().split('T')[0] : ''}
                                                readOnly={!isEditing}
                                            />
                                        </Box>

                                        <Box mb={8}>
                                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                                            <Input

                                                value={formData.name !== undefined ? formData.name : ''}
                                                mb={4}
                                                readOnly={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <FormLabel htmlFor="birthdate">Fecha Nacimiento:</FormLabel>
                                            <Input
                                                type="date"
                                                value={formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : ''}
                                                readOnly={!isEditing}
                                            />

                                        </Box>

                                        <Box>
                                            <FormLabel htmlFor="email">Correo:</FormLabel>
                                            <Input

                                                value={formData.email !== undefined ? formData.email : ''}
                                                readOnly={!isEditing}
                                                mb={4}
                                            />
                                            <FormLabel htmlFor="direction">Dirección:</FormLabel>
                                            <Input
                                                value={formData.direction !== undefined ? formData.direction : ''}
                                                readOnly={!isEditing}
                                            />
                                        </Box>

                                    </Flex>

                                    <Divider orientation='horizontal' w='75%' mb={4} />

                                    <Tabs variant='soft-rounded' colorScheme='green'>

                                        <TabList>
                                            <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Cargos y sueldos</Tab>
                                            <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Familiares</Tab>
                                            <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Ingresos y egresos</Tab>
                                        </TabList>

                                        <TabPanels>

                                            <TabPanel>
                                                <List /> {/* cambiar a los cargos*/}
                                            </TabPanel>

                                            <TabPanel>
                                                <List />
                                            </TabPanel>

                                        </TabPanels>
                                    </Tabs>
                                </Box>
                            </Flex>
                        </FormControl>
                    </form>
                </Flex>
            </Box>
        </>
    )
}