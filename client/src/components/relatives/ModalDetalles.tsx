import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    VStack,
    Text,
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

interface ModalDetallesProps {
    isOpen: boolean;
    onClose: () => void;
    familiar: Familiar | null;
}

export const ModalDetalles: React.FC<ModalDetallesProps> = ({ isOpen, onClose, familiar }) => {
    if (!familiar) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent bg="white" boxShadow="xl" borderRadius="lg">
                <ModalHeader
                    bg="#e4bdcc"
                    fontSize="2xl"
                    color="gray.600"
                    py={4}
                    px={6}
                    borderTopRadius="lg"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    Detalles del Familiar
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={8} px={6} color="gray.600">
                    <VStack align="stretch" justify="center" h="100%">
                        <Box p={2}>
                            <Text fontSize="2xl" mb={4}>
                                {familiar.name} {familiar.last_name}
                            </Text>
                            <Text mb={4}>
                                <strong>Cedula:</strong> {familiar.ci}
                            </Text>
                            <Text mb={4}>
                                <strong>Fecha de nacimiento:</strong> {familiar.birthday}
                            </Text>
                            <Text mb={4}>
                                <strong>Parentesco:</strong> {familiar.relationship}
                            </Text>
                            <Text mt={4}>
                                <strong>Dirección:</strong> {familiar.address}
                            </Text>
                            <Text mt={4}>
                                <strong>Teléfono:</strong> {familiar.telephone}
                            </Text>
                            <Text mt={4}>
                                <strong>Correo electronico:</strong> {familiar.email}
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};