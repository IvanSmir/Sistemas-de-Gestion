'use client'

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import PositionEmployee from "@/types/positionEmployee";



const positions = [
    "Funcionario",
    "Jefe",
    "Gerente",
    "Asistente",
    "Analista"
];

const wageTypes = [
    "Sueldo minimo",
    "Sueldo medio",
    "Sueldo alto",
    "Sueldo por hora",
    "Sueldo por proyecto"
];
interface FormPositionProps {
    position: PositionEmployee;
    setPosition: React.Dispatch<React.SetStateAction<PositionEmployee>>;
}

export const FormPosition: React.FC<FormPositionProps> = ({ position, setPosition }) => {


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPosition({ ...position, [name]: value });
    };

    useEffect(() => {
        if (position.wageType === "Sueldo minimo") {
            setPosition(prevState => ({ ...prevState, salary: 2550307 }));
        }
    }, [position.wageType, setPosition]);

    return (
        <form>
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="position">Cargo:</FormLabel>
                            <Select
                                id="position"
                                name="position"
                                value={position.position}
                                placeholder='Seleccione el cargo'
                                onChange={handleChange}
                            >
                                {positions.map((pos, index) => (
                                    <option key={index} value={pos}>{pos}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="wageType">Tipos de sueldo:</FormLabel>
                            <Select
                                id="wageType"
                                name="wageType"
                                value={position.wageType}
                                placeholder='Seleccione el tipo de sueldo'
                                onChange={handleChange}
                            >
                                {wageTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex justify-center w-[100%]">
                        <div className="w-4/5">
                            <FormControl>
                                <FormLabel htmlFor="salary">Salario:</FormLabel>
                                <Input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    type="number"
                                    id="salary"
                                    name="salary"
                                    onChange={handleChange}
                                    value={position.salary.toString()}
                                    readOnly={position.wageType === "Sueldo minimo"}
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
