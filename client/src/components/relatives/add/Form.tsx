'use client'
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Text, FormControl, Input, FormLabel, Select, Button, Flex, Box } from '@chakra-ui/react'
const ApiUrl = process.env.NEXT_PUBLIC_API_URL + '/family-types';

interface FormValues {
    name: string;
    last_name: string;
    address: string;
    telephone: string;
    email: string;
    ci: string;
    birthday: string;
    relationship: string;
}

export const Form: React.FC = () => {
    const [formData, setFormData] = useState<FormValues>({
        name: "",
        last_name: "",
        address: "",
        telephone: "",
        email: "",
        ci: "",
        birthday: "",
        relationship: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await fetch(ApiUrl);
            const data = await response.json();
            setFormData(data.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Flex justify="center" align="center" minH="90vh">
            <Box bg="white" p={5} borderRadius="md" boxShadow="md" width={{ base: "90%", sm: "80%", md: "70%", lg: "50%" }} padding="8px">
                <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Agregar familiar</Text>
                <form onSubmit={handleSubmit}>
                    <Flex direction={{ base: "column", md: "row" }} gap={6}>
                        <FormControl flex="1">
                            <FormLabel htmlFor="name">Nombre:</FormLabel>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={formData.name}
                                borderRadius="sm"
                            />
                        </FormControl>
                        <FormControl flex="1">
                            <FormLabel htmlFor="last_name">Apellido:</FormLabel>
                            <Input
                                type="text"
                                id="last_name"
                                name="last_name"
                                onChange={handleChange}
                                value={formData.last_name}
                                borderRadius="sm"
                            />
                        </FormControl>
                    </Flex>
                    <Flex direction={{ base: "column", md: "row" }} gap={6}>
                        <FormControl flex="1">
                            <FormLabel htmlFor="ci">Número de cédula:</FormLabel>
                            <Input
                                type="text"
                                id="ci"
                                name="ci"
                                onChange={handleChange}
                                value={formData.ci}
                                borderRadius="sm"
                            />
                        </FormControl>
                        <FormControl flex="1">
                            <FormLabel htmlFor="birthday">Fecha de nacimiento:</FormLabel>
                            <Input
                                type="date"
                                id="birthday"
                                name="birthday"
                                onChange={handleChange}
                                value={formData.birthday}
                                borderRadius="sm"
                            />
                        </FormControl>
                    </Flex>
                    <FormControl>
                        <FormLabel htmlFor="email">Correo electrónico:</FormLabel>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            borderRadius="sm"
                        />
                    </FormControl>
                    <Flex direction={{ base: "column", md: "row" }} gap={6}>
                        <FormControl flex="1">
                            <FormLabel htmlFor="relationship">Parentesco:</FormLabel>
                            <Select
                                id="relationship"
                                name="relationship"
                                onChange={handleChange}
                                value={formData.relationship}
                                borderRadius="sm"
                            >
                                <option value="padre">Padre</option>
                                <option value="madre">Madre</option>
                                <option value="hijo">Hijo</option>
                                <option value="hija">Hija</option>
                                <option value="esposo/esposa">Esposo/Esposa</option>
                            </Select>
                        </FormControl>
                        <FormControl flex="1">
                            <FormLabel htmlFor="telephone">Teléfono:</FormLabel>
                            <Input
                                type="tel"
                                id="telephone"
                                name="telephone"
                                onChange={handleChange}
                                value={formData.telephone}
                                borderRadius="sm"
                            />
                        </FormControl>
                    </Flex>
                    <Flex direction={{ base: "column" }} gap={6}>
                        <FormControl flex="1">
                            <FormLabel htmlFor="address">Dirección:</FormLabel>
                            <Input
                                type="text"
                                id="address"
                                name="address"
                                onChange={handleChange}
                                value={formData.address}
                                borderRadius="sm"
                            />
                        </FormControl>
                        <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type='submit' display="block" mx="auto">Guardar</Button>
                    </Flex>
                </form>
            </Box>
        </Flex>
    );
}


