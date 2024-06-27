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

interface confirmDeleteEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteEmployeeModal: React.FC<confirmDeleteEmployeeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmación</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    ¿Estás seguro que deseas eliminar este empleado?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mt={4} mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button mt={4} color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} onClick={handleConfirm}>
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDeleteEmployeeModal;
