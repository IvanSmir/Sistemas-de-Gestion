'use client'

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text } from '@chakra-ui/react';
import Position from "@/types/position";


interface PositionForm {
    name: string;
    description: string;

}
interface FormAddPositionProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: (position: Position) => void;

}
export const FormAddPosition: React.FC<FormAddPositionProps> = ({ isOpen, onClose, onChange, onSave }) => {

    const [position, setPosition] = useState<PositionForm>(
        {
            name: "",
            description: "",

        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let value = target.value;
        setPosition({ ...position, [target.name]: value });
    };

    return (
        <Flex justify="center" align="center" minH="90vh">
            <Box bg="white" p={5} borderRadius="md" boxShadow="md" width="90%">
                <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Agregar Cargo</Text>

                <form >

                    <FormControl>
                        <FormLabel htmlFor="name" >Nombre:</FormLabel>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleChange}
                            value={position.name}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="description" >Descripción:</FormLabel>
                        <Input
                            type="text"
                            id="description"
                            name="description"
                            onChange={handleChange}
                            value={position.description}
                        />
                    </FormControl>
                    <Flex>
                        <Button variant="ghost" onClick={onClose} mr={3}>
                            Cancelar
                        </Button>
                        <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3}>
                            Guardar
                        </Button>
                    </Flex>

                </form >
            </Box>
        </Flex  >
    )
}