import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";

interface GenericModal {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    text: string;
}

const GenericModalConfirm: React.FC<GenericModal> = ({
    isOpen,
    onClose,
    onConfirm,
    text,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {text}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mt={4} mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        mt={4}
                        color="white"
                        bgColor='#AA546D'
                        _hover={{ bgColor: "#c1738e" }}
                        onClick={() => {
                            onConfirm(); // Invoca la función onConfirm al hacer clic
                            onClose(); // También cierra el modal
                        }}
                    >
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GenericModalConfirm;
