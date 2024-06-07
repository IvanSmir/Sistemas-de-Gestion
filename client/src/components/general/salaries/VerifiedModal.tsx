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
    areVerified: boolean;
    operation: string;
    confirmOperation: boolean;
    setConfirmOperation: React.Dispatch<React.SetStateAction<boolean>>;
    showDownload: boolean;
    setIsGenerar: React.Dispatch<React.SetStateAction<boolean>>;
    setCierre: React.Dispatch<React.SetStateAction<boolean>>;
}

const VerifiedModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    areVerified,
    operation,
    confirmOperation,
    setConfirmOperation,
    showDownload,
    setIsGenerar,
    setCierre,
}) => {

    const handleConfirm = () => {
        setConfirmOperation(true);

        if (operation === "Generar") {
            setCierre(true);
            setIsGenerar(true);
        }
        onConfirm();
    };

    const getOperationMessage = () => {
        switch (operation) {
            case "Cierre":
                return "Aún hay salarios sin verificar, ¿Estás seguro que deseas cerrar el Pago de Salarios? Esta acción no se puede deshacer.";
            case "Generar":
                return "¿ Estás seguro que deseas generar el Pago de Salarios? Esta acción no se puede deshacer.";
            case "bonificaciones":
                return "¿Estás seguro que deseas asignar las bonificaciones? Esta acción no se puede deshacer.";
            case "IPS":
                return "¿Estás seguro que deseas asignar IPS? Esta acción no se puede deshacer.";
            default:
                return areVerified ?
                    "¿Estás seguro que deseas cerrar el Pago de Salarios? Esta acción no se puede deshacer." :
                    "Aún hay salarios sin verificar, ¿Estás seguro que deseas cerrar el Pago de Salarios? Esta acción no se puede deshacer.";
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar {operation}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {getOperationMessage()}
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

export default VerifiedModal;
