'use client'
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Flex,
    Box,
    Text,
    Switch,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface Income {
    name: string;
    description: string;
}

interface ModalProps {

    isOpen: boolean;
    onClose: () => void;

}

export const Income: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<Income>(
        {
            name: "",
            description: "",



        }
    );


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let value = target.value;
        setFormData({ ...formData, [target.name]: value });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);


    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent minW={"50vw"}>
                <ModalCloseButton />
                <ModalBody>

                    <Flex justify="center" align="center" minH="50vh">
                        <Box bg="white" p={5} borderRadius="md" width="70%">
                            <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D">Ingreso</Text>
                            <form>
                                <FormControl >
                                    <FormLabel htmlFor="incomeType">Tipo de Ingreso:</FormLabel>
                                    <Select
                                        id="incomeType"
                                        name="incomeType"
                                        borderRadius="sm"
                                    >
                                        <option value="extra">Horas extras</option>
                                        <option value="comision">Comisiones</option>
                                        <option value="bonos">Bonos</option>
                                    </Select>
                                </FormControl>

                                <FormControl >


                                    <FormLabel htmlFor="amount">Monto:</FormLabel>
                                    <Input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        borderRadius="sm"
                                        w={'100%'}
                                    />
                                </FormControl>

                                <ModalFooter
                                >
                                    <Button variant="ghost" onClick={onClose} mr={3}>
                                        Cancelar
                                    </Button>
                                    <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} type="submit" mr={3}>
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </Box>
                    </Flex>
                </ModalBody>

            </ModalContent>
        </Modal>
    );
};
