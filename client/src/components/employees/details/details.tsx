'use client'
import { PhoneIcon } from '@chakra-ui/icons'
import { AbsoluteCenter, As, AspectRatio, Avatar, Box, Button, Container, Divider, Fade, Flex, FormControl, FormLabel, Grid, GridItem, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import React, { useState } from 'react'
import { List } from '@/components/relatives/List'
import router from 'next/router'


export const EmployeeDetails = () => {

    const [formData, setFormData] = useState(
        {
            name: "",
            email: "",
            image: "",
            gender: "",
            direction: "",
            phone: " ",
            ruc: "",
            joinDate: new Date(),
            birthdate: new Date(),
            cargo: "",
            detalle: "",
            sueldoBase: ""
        }
    );

    const handleBack = () => {
        router.back()
    }
    return (
        <>
            <form>
                <FormControl>
                    <Text fontSize='24px' mb={4} fontWeight='bold' color="#4b4b4b" > Juan Lopez</Text>
                    <Flex direction={{ base: "column", md: "row" }} gap={6}>
                        <Box display="flex">
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
                                        type="text"
                                        id="ruc"
                                        name="ruc"
                                        value={formData.ruc}
                                        readOnly
                                        mb={4}
                                    />
                                    <FormLabel htmlFor="gender">Sexo:</FormLabel>
                                    <Input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        readOnly
                                        mb={4}
                                    />

                                    <FormLabel htmlFor="cargo">Cargo:</FormLabel>
                                    <Input
                                        type="text"
                                        id="cargo"
                                        name="cargo"
                                        value={formData.cargo}
                                        mb={4}
                                        readOnly
                                    />
                                </Box>

                                <Box mb={8}>
                                    <FormLabel htmlFor="name">Nombre:</FormLabel>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        mb={4}
                                        readOnly
                                    />
                                    <FormLabel htmlFor="birthdate">Fecha Nacimiento:</FormLabel>
                                    <Input
                                        type="text"
                                        id="birthdate"
                                        name="birthdate"
                                        value={formData.birthdate.toLocaleDateString()}
                                        readOnly
                                        mb={4}
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor="email">Correo:</FormLabel>
                                    <Input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        mb={4}
                                    />
                                    <FormLabel htmlFor="direction">Dirección:</FormLabel>
                                    <Input
                                        type="text"
                                        id="direction"
                                        name="direction"
                                        value={formData.direction}
                                        readOnly
                                    />
                                </Box>
                            </Flex>

                            <Divider orientation='horizontal' w='75%' mb={4} />

                            <Tabs variant='soft-rounded' colorScheme='green'>

                                <TabList>
                                    <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Datos Generales</Tab>
                                    <Tab _selected={{ color: 'white', bg: '#AA546D' }}>Familiares</Tab>
                                </TabList>

                                <TabPanels>

                                    <TabPanel>
                                        <Flex >
                                            <Box mr={8}>
                                                <FormLabel htmlFor="joinDate">Fecha Ingreso:</FormLabel>
                                                <Input
                                                    type="date"
                                                    id="joinDate"
                                                    name="joinDate"
                                                    value={formData.joinDate.toLocaleDateString()}
                                                    readOnly
                                                />
                                            </Box>
                                            <Box mr={8}>
                                                <FormLabel htmlFor="detalle">Detalle:</FormLabel>
                                                <Input
                                                    type="text"
                                                    id="detalle"
                                                    name="detalle"
                                                    value={formData.detalle}
                                                    readOnly
                                                />
                                            </Box>
                                            <Box>
                                                <FormLabel htmlFor="sueldoBase">Sueldo Base:</FormLabel>
                                                <Input
                                                    type="text"
                                                    id="sueldoBase"
                                                    name="direction"
                                                    value={formData.sueldoBase}
                                                    readOnly
                                                />
                                            </Box>
                                        </Flex>
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

            <Spacer />
            <Link href="/funcionarios">
                <Button
                    position="absolute"

                    bottom="4"
                >
                    Volver
                </Button>
            </Link>
        </>
    )
}