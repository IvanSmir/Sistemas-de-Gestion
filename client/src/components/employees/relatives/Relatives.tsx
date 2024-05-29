'use client'

import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { FormRelative } from '@/components/relatives/add/FormRelativeStepper';
import { TablePerson } from '@/components/lists/TablePerson';
import Relative from '@/types/relative';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form';

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
        birthDateFormatted: new Date(relative.birthDate).toLocaleDateString('es-ES')
    }));
};

interface FormRelativeProps {
    relative: Relative[];
    setRelative: React.Dispatch<React.SetStateAction<Relative[]>>;
    register: UseFormRegister<Relative>;
    errors: FieldErrors<Relative>;
    handleSubmit: UseFormHandleSubmit<Relative>;
    setValue: UseFormSetValue<Relative>;
    employeeCiRuc: string;
}

export const ModalRelative: React.FC<FormRelativeProps> = ({ relative, setRelative, register, errors, handleSubmit, setValue, employeeCiRuc }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [filteredRelatives, setFilteredRelatives] = useState<Relative[]>([]);

    useEffect(() => {
        const filtered = relative.filter((relative) => {
            if (employeeCiRuc === relative.ciRuc) {
                return false;
            }
            return true;
        });
        setFilteredRelatives(filtered);
    }, [employeeCiRuc, relative]);

    const transformedData = transformRelatives(filteredRelatives);

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
                            setValue={setValue}
                            employeeCiRuc={employeeCiRuc}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
