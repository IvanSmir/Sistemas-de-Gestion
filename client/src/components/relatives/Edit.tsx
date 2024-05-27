import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    Select,
    Button
} from "@chakra-ui/react";
import Relative from "@/types/relative";
import { useAuth } from "../context/AuthProvider";
import { getFamilyTypes } from "@/utils/family.http";
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
interface FamilyTypes {
    id: string;
    name: string;
}
interface EditFamiliarProps {
    isOpen: boolean;
    onClose: () => void;
    relative: FamilyMember;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Agregar onChange aquí
    onSave: (editedRelative: FamilyMember) => void;
    familiarId: string;
}


export const EditFamiliar: React.FC<EditFamiliarProps> = ({ isOpen, onClose, relative, onChange, onSave, familiarId }) => {
    const auth = useAuth();
    const [editedRelative, setEditedRelative] = useState<FamilyMember>(relative);
    const [familyTypes, setFamilyTypes] = useState<FamilyTypes[]>([]);
    const [familyType, setFamilyType] = useState<FamilyTypes>({ id: '', name: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRelative(prevState => ({
            ...prevState,
            person: {
                ...prevState.person,
                [name]: value
            }
        }));
        onChange(e);
    };

    const handleSave = () => {
        // Llama a onSave con el estado actualizado
        onSave(editedRelative);
    };
    useEffect(() => {
        const fetchData = async () => {
            const { user } = auth;
            const token = user?.token || '';
            const familyTypesResponse = await getFamilyTypes(token);
            console.log('familyTypesResponse', familyTypesResponse);
            setFamilyTypes(familyTypesResponse.data);
        };
        fetchData();
    }, [auth]);




    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Familiar</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Input
                        name="name"
                        placeholder="Nombre"
                        value={editedRelative.person.name}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="address"
                        placeholder="Dirección"
                        value={editedRelative.person.address}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="phone"
                        placeholder="Teléfono"
                        value={editedRelative.person.phone}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="email"
                        placeholder="Email"
                        value={editedRelative.person.email}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="ciRuc"
                        placeholder="CI/RUC"
                        value={editedRelative.person.ciRuc}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Input
                        name="birthDate"
                        type="date"
                        placeholder="Fecha de Nacimiento"
                        value={editedRelative.person.birthDate.split('T')[0]}
                        onChange={handleChange}
                        mb={3}
                    />
                    <Select
                        id="relationship"
                        name="relationship"
                        onChange={handleChange}
                        value={relative.familyTypeId}
                        borderRadius="sm"
                    >
                        {familyTypes.map((type => (

                            <option key={type.id} value={type.id}>{type.name}</option>
                        )))
                        }


                    </Select>

                    <Button colorScheme="blue" onClick={handleSave}>
                        Guardar
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
