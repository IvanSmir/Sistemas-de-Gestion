import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
} from "@chakra-ui/react";

interface EntryDetail {
    account: string;
    debe: number;
    haber: number;
}

interface SalaryPayment {
    id: string;
    period: string;
    description: string;
    details: EntryDetail[];
}

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: SalaryPayment | null;
}

export const ModalDetalles: React.FC<DetailsModalProps> = ({ isOpen, onClose, entry }) => {
    const calculateTotal = (details: EntryDetail[], type: 'debe' | 'haber') => {
        return details.reduce((sum, detail) => sum + detail[type], 0);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay  bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(10px)" />
            <ModalContent>
                <ModalHeader>Detalles del Asiento contable</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {entry ? (
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Cuenta</Th>
                                    <Th>Debe</Th>
                                    <Th>Haber</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {entry.details.map((detail, index) => (
                                    <Tr key={index}>
                                        <Td>{detail.account}</Td>
                                        <Td>{detail.debe.toFixed(2)}</Td>
                                        <Td>{detail.haber.toFixed(2)}</Td>
                                    </Tr>
                                ))}
                                <Tr fontWeight="bold">
                                    <Td>Total</Td>
                                    <Td>{calculateTotal(entry.details, 'debe').toFixed(2)}</Td>
                                    <Td>{calculateTotal(entry.details, 'haber').toFixed(2)}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    ) : (
                        <p>No se han encontrado detalles.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};


