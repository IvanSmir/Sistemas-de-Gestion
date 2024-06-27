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

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmAddEmployeeModal: React.FC<ConfirmationModalProps> = ({
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
                    Este empleado ha sido borrado. ¿Desea volver a agregarlo?
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

export default ConfirmAddEmployeeModal;
