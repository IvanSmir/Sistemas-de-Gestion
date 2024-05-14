'use client'
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { InputGroup, Center, Input, Button, IconButton, InputLeftElement, InputRightElement, Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface FormValues {
    name: string;
    description: string;
    sueldoBase: number;
}

export const FormCargo: React.FC = () => {
    const router = useRouter()

    const [formData, setFormData] = useState<FormValues>(
        {
            name: "",
            description: "",
            sueldoBase: 0,
        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        setFormData({ ...formData, [target.name]: target.value });
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(formData);
        try {
            const response = await axios.post("http://localhost:3002/cargos", { ...formData, sueldoBase: +formData.sueldoBase });
            console.log(+formData.sueldoBase);
            console.log(response);
            router.push('/generales/cargos')

        } catch (error) {
            console.log(error);
        }
    };



    return (


        <form className="bg-[#F3F3F3] h-full relative" onSubmit={handleSubmit}>

            <div className="absolute h-auto min-h-[80vh] max-h-[80vh] rounded-md bg-white w-[60%] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div>
                    <InputGroup m={2}>
                        <InputRightElement mx={5} >
                            <IconButton variant='outline' aria-label='Cerrar' border='none' icon={<CloseIcon />}></IconButton>
                        </InputRightElement>
                    </InputGroup>
                    <div mr-8>
                        <h1 className='text-4xl' >Cargos</h1>
                    </div>
                    <Box w={400} m={5}>

                        <label className="block  font-size={13} pt-5 font-medium text-gray-700" htmlFor="name">
                            Nombre:*
                            <InputGroup>

                                <Input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" size='sm'
                                    type='text'
                                    placeholder='Nombre'
                                    onChange={handleChange}
                                    name="name"
                                />
                            </InputGroup>
                        </label>

                        <label className="block font-size={14} pt-5  font-medium text-gray-700" htmlFor="description">
                            Descripción:*
                            <InputGroup>

                                <Input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" size='sm'
                                    type='text'
                                    placeholder=''
                                    id="description"
                                    onChange={handleChange}
                                    name="description"
                                />
                            </InputGroup>

                        </label>

                        <label className="block font-size={14} py-5 font-medium text-gray-700" htmlFor="sueldoBase">
                            Sueldo Base:
                            <InputGroup>

                                <Input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" size='sm'
                                    type='text'
                                    placeholder='Gs.'
                                    id="sueldoBase"
                                    onChange={handleChange}
                                    name="sueldoBase"
                                />
                            </InputGroup>

                        </label>

                        <div  >
                            
                            <Button position='relative' h='100px' background='#D18F9D' _hovertext-white font-bold py={2} px={4} mt={5} rounded-full type="submit">
                                Cargar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </form>


    );

};
