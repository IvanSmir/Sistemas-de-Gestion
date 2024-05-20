import React, { ChangeEvent } from "react";
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
    Text
} from "@chakra-ui/react";

interface Familiar {
    id: number;
    name: string;
    last_name: string;
    address: string;
    telephone: string;
    email: string;
    ci: string;
    birthday: string;
    relationship: string;
}

interface EditFamiliarModalProps {
    isOpen: boolean;
    onClose: () => void;
    familiar: Familiar | null;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: () => void;
}

export const EditFamiliar: React.FC<EditFamiliarModalProps> = ({ isOpen, onClose, familiar, onChange, onSave }) => {
    if (!familiar) return null;



    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex justify="center" align="center" minH="50vh">
                        <Box bg="white" p={5} borderRadius="md" width="90%">
                            <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Editar familiar</Text>
                            <form>
                                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                                    <FormControl>
                                        <FormLabel htmlFor="name">Nombre:</FormLabel>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            onChange={onChange}
                                            value={familiar.name}
                                            borderRadius="sm"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="last_name">Apellido:</FormLabel>
                                        <Input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            onChange={onChange}
                                            value={familiar.last_name}
                                            borderRadius="sm"
                                        />
                                    </FormControl>
                                </Flex>
                                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                                    <FormControl>
                                        <FormLabel htmlFor="ci">Número de cédula:</FormLabel>
                                        <Input
                                            type="text"
                                            id="ci"
                                            name="ci"
                                            onChange={onChange}
                                            value={familiar.ci}
                                            borderRadius="sm"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="birthday">Fecha de nacimiento:</FormLabel>
                                        <Input
                                            type="date"
                                            id="birthday"
                                            name="birthday"
                                            onChange={onChange}
                                            value={familiar.birthday}
                                            borderRadius="sm"
                                        />
                                    </FormControl>
                                </Flex>
                                <FormControl mb={4}>
                                    <FormLabel htmlFor="email">Correo electrónico:</FormLabel>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={onChange}
                                        value={familiar.email}
                                        borderRadius="sm"
                                    />
                                </FormControl>
                                <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                                    <FormControl>
                                        <FormLabel htmlFor="relationship">Parentesco:</FormLabel>
                                        <Select
                                            id="relationship"
                                            name="relationship"
                                            onChange={onChange}
                                            value={familiar.relationship}
                                            borderRadius="sm"
                                        >
                                            <option value="padre">Padre</option>
                                            <option value="madre">Madre</option>
                                            <option value="hijo">Hijo</option>
                                            <option value="hija">Hija</option>
                                            <option value="esposo/esposa">Esposo/Esposa</option>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="telephone">Teléfono:</FormLabel>
                                        <Input
                                            type="tel"
                                            id="telephone"
                                            name="telephone"
                                            onChange={onChange}
                                            value={familiar.telephone}
                                            borderRadius="sm"
                                        />
                                    </FormControl>
                                </Flex>
                                <FormControl mb={4}>
                                    <FormLabel htmlFor="address">Dirección:</FormLabel>
                                    <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        onChange={onChange}
                                        value={familiar.address}
                                        borderRadius="sm"
                                    />
                                </FormControl>
                            </form>
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose} mr={3}>
                        Cancelar
                    </Button>
                    <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} onClick={onSave} mr={3}>
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
