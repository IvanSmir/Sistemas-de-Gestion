import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Table,
    Tbody,
    Tr,
    Td,
} from "@chakra-ui/react";
import Relative from "@/types/relative";

interface Person {
    ciRuc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
}

interface FamilyMember extends Relative {
    id: string;
    familyType: {
        name: string;
    };
    person: Person; 
}

interface FamilyMembersResponse {
    data: FamilyMember[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalCount: number;
}

interface ModalDetallesProps {
    isOpen: boolean;
    onClose: () => void;
    relative: FamilyMember;
}


export const ModalDetalles: React.FC<ModalDetallesProps> = ({ isOpen, onClose, relative }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalles del Familiar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Table variant="simple">
                        <Tbody>
                            <Tr>
                                <Td>Nombre:</Td>
                                <Td>{relative.person.name}</Td>
                            </Tr>
                            <Tr>
                                <Td>Dirección:</Td>
                                <Td>{relative.person.address}</Td>
                            </Tr>
                            <Tr>
                                <Td>Teléfono:</Td>
                                <Td>{relative.person.phone}</Td>
                            </Tr>
                            <Tr>
                                <Td>Email:</Td>
                                <Td>{relative.person.email}</Td>
                            </Tr>
                            <Tr>
                                <Td>CI/RUC:</Td>
                                <Td>{relative.person.ciRuc}</Td>
                            </Tr>
                            <Tr>
                                <Td>Fecha de Nacimiento:</Td>
                                <Td>{new Date(relative.person.birthDate).toLocaleDateString()}</Td>
                            </Tr>
                            <Tr>
                                <Td>Tipo de Parentesco:</Td>
                                <Td>{relative.familyType.name}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
