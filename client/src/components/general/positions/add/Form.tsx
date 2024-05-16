'use client'

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import Position from "@/types/position";



export const FormAddPosition: React.FC = () => {
    const [position, setPosition] = useState<Position>(
        {
            name: "",
            description: "",

        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let value = target.value;
        setPosition({ ...position, [target.name]: value });
    };

    return (
        <form >

            <FormControl>
                <FormLabel htmlFor="name" >Nombre:</FormLabel>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={position.name}
                />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="description" >Descripción:</FormLabel>
                <Input
                    type="text"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={position.description}
                />
            </FormControl>
        </form >
    )
}