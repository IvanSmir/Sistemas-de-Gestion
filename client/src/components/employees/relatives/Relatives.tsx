'use client'

import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { FormRelative } from '@/components/relatives/add/Form';
import { TablePerson } from '@/components/lists/TablePerson';
import Relative from '@/types/relative';


const initialData: Relative[] = [
    {
        name: "Juan",
        last_name: "Pérez",
        address: "Calle Falsa 123, Ciudad Real",
        phone: "5551234567",
        email: "juan.perez@example.com",
        ci: "V-12345678",
        birthDate: new Date("1985-03-15"),
        gender: "male",
        relationshipType: "father"
    },
    {
        name: "María",
        last_name: "García",
        address: "Avenida Siempreviva 456, Ciudad Esperanza",
        phone: "5559876543",
        email: "maria.garcia@example.com",
        ci: "V-23456789",
        birthDate: new Date("1989-07-20"),
        gender: "female",
        relationshipType: "sister"
    },
    {
        name: "Carlos",
        last_name: "Martínez",
        address: "Paseo de los Olivos 789, Nueva Vida",
        phone: "5556543210",
        email: "carlos.martinez@example.com",
        ci: "V-34567890",
        birthDate: new Date("1992-10-05"),
        gender: "male",
        relationshipType: "cousin"
    },
    {
        name: "Lucía",
        last_name: "Fernández",
        address: "Ronda del Valle 321, Ciudad Sol",
        phone: "5553214567",
        email: "lucia.fernandez@example.com",
        ci: "V-45678901",
        birthDate: new Date("1996-12-15"),
        gender: "female",
        relationshipType: "daughter"
    }
];

const columnMapping = {
    'Nombre Completo': 'fullName',
    'Dirección': 'address',
    'Teléfono': 'phone',
    'Correo Electrónico': 'email',
    'Cédula de Identidad': 'ci',
    'Fecha de Nacimiento': 'birthDateFormatted',
    'Género': 'gender',
    'Parentesco': 'relationshipType'
};

const transformRelatives = (relatives: Relative[]) => {
    return relatives.map(relative => ({
        ...relative,
        fullName: `${relative.name} ${relative.last_name}`,
        birthDateFormatted: relative.birthDate.toLocaleDateString('es-ES')
    }));
};

interface FormRelativeProps {
    relative: Relative[];
    setRelative: React.Dispatch<React.SetStateAction<Relative[]>>;
}

export const ModalRelative: React.FC<FormRelativeProps> = ({ relative, setRelative }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [relatives, setRelatives] = useState<Relative[]>(initialData);

    const transformedData = transformRelatives(relatives);

    return (
        <>
            <Button onClick={onOpen}>Agregar</Button>
            <TablePerson data={transformedData} columnMapping={columnMapping} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody pb={6}>
                        <FormRelative
                            relatives={relatives}
                            setRelatives={setRelatives}
                            onClose={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
