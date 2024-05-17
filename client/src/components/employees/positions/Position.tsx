'use client'

import Image from "next/image";
import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import PositionEmployee from "@/types/positionEmployee";
import { FieldErrors, UseFormRegister } from "react-hook-form";


const ApiUrl = process.env.NEXT_PUBLIC_API_URL

interface FormPositionProps {
    register: UseFormRegister<PositionEmployee>;
    errors: FieldErrors<PositionEmployee>;
}

export const FormPosition: React.FC<FormPositionProps> = ({ register, errors }) => {
    const [positions, setPositions] = useState<{ id: string, name: string }[]>([]);
    const [wageTypes, setWageTypes] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await fetch(`${ApiUrl}/positions?limit=1000&page=1`);
            const data = await response.json();
            setPositions(data.data);
        }
        const fetchWageTypes = async () => {
            const response = await fetch(`${ApiUrl}/income-types?limit=1000&page=1`);
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
                        <FormControl isInvalid={!!errors.incomeTypeId}>
                            <FormLabel htmlFor="incomeTypeId">Tipos de sueldo:</FormLabel>
                            <Select
                                id="incomeTypeId"
                                placeholder='Seleccione el tipo de sueldo'
                                {...register('incomeTypeId')}
                            >
                                {wageTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.incomeTypeId?.message}</FormErrorMessage>
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
