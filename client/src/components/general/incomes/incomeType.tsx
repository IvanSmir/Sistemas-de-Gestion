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
    Switch
} from "@chakra-ui/react";

interface IncomeType {
    name: string;
    description: string;
    deductible: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;

}

export const IncomeType: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<IncomeType>(
        {
            name: "",
            description: "",
            deductible: true,
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
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex justify="center" align="center" minH="50vh">
                        <Box bg="white" p={5} borderRadius="md" width="90%">
                            <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Tipo de Ingreso</Text>
                            <form onSubmit={handleSubmit}>
                                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                                    <FormControl>
                                        <FormLabel htmlFor="name">Nombre:</FormLabel>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            borderRadius="sm"
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="description">Descripcion:</FormLabel>
                                        <Input
                                            type="text"
                                            id="description"
                                            name="description"
                                            borderRadius="sm"
                                            onChange={handleChange}

                                        />
                                    </FormControl>
                                </Flex>
                                <FormControl>
                                    <FormLabel htmlFor="deductible">Es deducible:</FormLabel>
                                    <Switch id='deductible' onChange={handleChange}
                                    />

                                </FormControl>
                                <ModalFooter>
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
