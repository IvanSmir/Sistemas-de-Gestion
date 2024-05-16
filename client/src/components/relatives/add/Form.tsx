'use client'

import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalCloseButton, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import Relative from '@/types/relative';


interface FormRelativeProps {
    relatives: Relative[];
    setRelatives: (relatives: Relative[]) => void;
    onClose: () => void;
}

export const FormRelative: React.FC<FormRelativeProps> = ({ relatives, setRelatives, onClose }) => {
    const [relative, setRelative] = useState<Relative>({
        name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
        ci: "",
        birthDate: new Date(),
        gender: "",
        relationshipType: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        let value: any = target.value;

        if (target.name === 'birthDate' && target instanceof HTMLInputElement) {
            value = new Date(target.value);
        }

        setRelative({ ...relative, [target.name]: value });
    };


    const handleSubmit = () => {
        setRelatives([...relatives, relative]);
        onClose();
    };

    return (

        <form>
            <ModalHeader >Agregar Familiar</ModalHeader>
            <ModalCloseButton />
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="name" >Nombre:</FormLabel>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={relative.name}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="last_name">
                                Apellido:
                            </FormLabel>

                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="last_name"
                                id="last_name"
                                onChange={handleChange}

                                value={relative.last_name}
                                name="last_name"
                            />
                        </FormControl>
                    </div>
                    <FormControl>
                        <FormLabel htmlFor="ci">Número de cédula:
                        </FormLabel>

                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="ci"
                            onChange={handleChange}

                            value={relative.ci}
                            name="ci"
                        />
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="relationshipType">Parentesco:
                            </FormLabel>

                            <Select
                                className="mt-1 block w-full border  border-gray-300 rounded-md shadow-sm p-2"

                                id="relationshipType"
                                name="relationshipType"
                                onChange={handleChange}
                                value={relative.relationshipType}
                                borderRadius="sm"
                            >
                                <option value="father">Padre</option>
                                <option value="mother">Madre</option>
                                <option value="son">Hijo</option>
                                <option value="daughter">Hija</option>
                                <option value="husband"> Esposo</option>
                                <option value="wife">Esposa</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="gender">Genero:
                            </FormLabel>

                            <Select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                id="gender"
                                name="gender"
                                onChange={handleChange}
                                value={relative.gender}
                                borderRadius="sm"
                            >
                                <option value="female">Femenino</option>
                                <option value="male">Masculino</option>

                            </Select>
                        </FormControl>

                    </div>
                    <FormControl>
                        <FormLabel htmlFor="email">
                            Correo Electrónico:
                        </FormLabel>

                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="email"
                            id="email"
                            onChange={handleChange}

                            value={relative.email}
                            name="email"
                        />
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="birthDate">Fecha de Nacimiento:</FormLabel>
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="birthDate"
                                onChange={handleChange}
                                value={relative.birthDate ? relative.birthDate.toISOString().split('T')[0] : ''}
                                name="birthDate"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="phone">
                                Teléfono:
                            </FormLabel>

                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="number"
                                id="phone"
                                onChange={handleChange}
                                value={relative.phone}
                                name="phone"
                            />
                        </FormControl>
                    </div>
                    <FormControl>
                        <FormLabel htmlFor="address">
                            Dirección:
                        </FormLabel>

                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="address"
                            onChange={handleChange}
                            value={relative.address}
                            name="address"
                        />
                    </FormControl>
                </div>

            </div>
            <ModalFooter>
                <Button onClick={handleSubmit} colorScheme='blue' mr={3}>
                    Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </form >
    )
}