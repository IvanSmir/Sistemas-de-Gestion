'use client'

import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { FormRelative } from '@/components/relatives/add/Form';
import { TablePerson } from '@/components/lists/TablePerson';
import Relative from '@/types/relative';
import { Field, FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

const columnMapping = {
    'Nombre Completo': 'fullName',
    'Dirección': 'address',
    'Teléfono': 'phone',
    'Correo Electrónico': 'email',
    'Cédula de Identidad': 'ciRuc',
    'Fecha de Nacimiento': 'birthDateFormatted',
    'Género': 'gender',
    'Parentesco': 'familyTypeId'
};

const transformRelatives = (relatives: Relative[]) => {
    return relatives.map(relative => ({
        ...relative,
        fullName: `${relative.name}`,
        birthDateFormatted: relative.birthDate.toLocaleDateString('es-ES')
    }));
};

interface FormRelativeProps {
    relative: Relative[];
    setRelative: React.Dispatch<React.SetStateAction<Relative[]>>;
    register: UseFormRegister<Relative>;
    errors: FieldErrors<Relative>;
    handleSubmit: UseFormHandleSubmit<Relative>;
}

export const ModalRelative: React.FC<FormRelativeProps> = ({ relative, setRelative, register, errors, handleSubmit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const transformedData = transformRelatives(relative);

    return (
        <>
            <Button onClick={onOpen}>Agregar</Button>
            <TablePerson data={transformedData} columnMapping={columnMapping} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody pb={6}>
                        <FormRelative
                            register={register}
                            errors={errors}
                            relatives={relative}
                            setRelatives={setRelative}
                            onClose={onClose}
                            handleSubmit={handleSubmit}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
