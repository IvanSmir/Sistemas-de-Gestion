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

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ModalEliminar: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Eliminación</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    ¿Estás seguro que deseas eliminar este? Esta acción no se puede deshacer.
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="gray" mt={4} mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} onClick={onConfirm}>Eliminar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEliminar;
