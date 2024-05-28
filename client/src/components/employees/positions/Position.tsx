'use client'

import Image from "next/image";
import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import PositionEmployee from "@/types/positionEmployee";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
const SALARIO_MINIMO = 1000;

interface FormPositionProps {
    register: UseFormRegister<PositionEmployee>;
    errors: FieldErrors<PositionEmployee>;
    setValue: UseFormSetValue<PositionEmployee>;
}

export const FormPosition: React.FC<FormPositionProps> = ({ register, errors, setValue }) => {
    const [positions, setPositions] = useState<{ id: string, name: string }[]>([]);
    const [salaryType, setSalaryType] = useState<string>("");

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await fetch(`${ApiUrl}/positions?limit=1000&page=1`);
            const data = await response.json();
            setPositions(data.data);
        };
        fetchPositions();
    }, []);

    useEffect(() => {
        if (salaryType === "minimum") {
            setValue('amount', SALARIO_MINIMO); 
        }
    }, [salaryType, setValue]);

    return (
        <form>
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="flex gap-4">
                        <FormControl isInvalid={!!errors.positionId}>
                            <FormLabel htmlFor="position">Cargo:</FormLabel>
                            <Select
                                id="positionId"
                                placeholder='Seleccione el cargo'
                                {...register('positionId')}
                            >
                                {positions.map((pos) => (
                                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.positionId?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.salaryType}>
                            <FormLabel htmlFor="salaryType">Tipos de sueldo:</FormLabel>
                            <Select
                                id="salaryType"
                                placeholder='Seleccione el tipo de sueldo'
                                {...register('salaryType', { onChange: (e) => setSalaryType(e.target.value) })}
                            >
                                <option value="minimum">Salario Minimo</option>
                                <option value="base">Salario Base</option>
                            </Select>
                            <FormErrorMessage>{errors.salaryType?.message}</FormErrorMessage>
                        </FormControl>
                    </div>
                    <div className="flex justify-center w-[100%]">
                        <div className="w-4/5">
                            <FormControl isInvalid={!!errors.amount}>
                                <FormLabel htmlFor="amount">Salario:</FormLabel>
                                <Input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    type="number"
                                    id="amount"
                                    {...register('amount')}
                                    disabled={salaryType === "minimum"}
                                />
                                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
