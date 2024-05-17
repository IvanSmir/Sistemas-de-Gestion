'use client'

import Image from "next/image";
import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import PositionEmployee from "@/types/positionEmployee";
import { FieldErrors, UseFormRegister } from "react-hook-form";

// const positions = [
//     "Funcionario",
//     "Jefe",
//     "Gerente",
//     "Asistente",
//     "Analista"
// ];

const wageTypes = [
    "Sueldo minimo",
    "Sueldo medio",
    "Sueldo alto",
    "Sueldo por hora",
    "Sueldo por proyecto"
];

interface FormPositionProps {
    register: UseFormRegister<PositionEmployee>;
    errors: FieldErrors<PositionEmployee>;
}

export const FormPosition: React.FC<FormPositionProps> = ({ register, errors }) => {
    const [positions, setPositions] = useState<{ id: string, name: string }[]>([]);
    const [wageTypes, setWageTypes] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await fetch('http://localhost:3000/api/positions?limit=10&page=1');
            const data = await response.json();
            setPositions(data.data);
        }
        const fetchWageTypes = async () => {
            const response = await fetch('http://localhost:3000/api/income-types');
            const data = await response.json();
            setWageTypes(data.data);
        }
        fetchPositions();
        fetchWageTypes();
    }, []);
    return (
        <form>
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.position}>
                            <FormLabel htmlFor="position">Cargo:</FormLabel>
                            <Select
                                id="position"
                                placeholder='Seleccione el cargo'
                                {...register('position')}
                            >
                                {positions.map((pos) => (
                                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.position?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.wageType}>
                            <FormLabel htmlFor="wageType">Tipos de sueldo:</FormLabel>
                            <Select
                                id="wageType"
                                placeholder='Seleccione el tipo de sueldo'
                                {...register('wageType')}
                            >
                                {wageTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.wageType?.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <div className="flex justify-center w-[100%]">
                        <div className="w-4/5">
                            <FormControl isInvalid={!!errors.salary}>
                                <FormLabel htmlFor="salary">Salario:</FormLabel>
                                <Input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    type="number"
                                    id="salary"
                                    {...register('salary')}
                                />
                                <FormErrorMessage>{errors.salary?.message}</FormErrorMessage>
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
