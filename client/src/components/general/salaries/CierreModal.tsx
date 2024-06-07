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

interface CierreModal {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    detailsWhiteoutVerified: number;
}

const CierreModalConfirm: React.FC<CierreModal> = ({
    isOpen,
    onClose,
    onConfirm,
    detailsWhiteoutVerified,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {detailsWhiteoutVerified != 0 && (
                        <p>Aun existen detalles sin verificar.</p>
                    )}
                    ¿Estás seguro que deseas cerrar el Pago de Salarios? Esta acción no se puede deshacer.
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

export default CierreModalConfirm;
