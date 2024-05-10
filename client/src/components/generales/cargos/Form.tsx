'use client'
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { InputGroup, InputLeftElement, Input, Button} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

interface FormValues {
    name: string;
    description: string;
    sueldoBase: number;
}

export const Form: React.FC = () => {
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
            <div>
                <div className="absolute h-auto min-h-[80vh] max-h-[80vh] rounded-md bg-white w-[70%] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div>
                    <h1 className='text-4xl' >Cargos</h1>
                        <label className="block text-xl font-medium pt-5 text-gray-700" htmlFor="name">
                            Nombre:
                            <InputGroup>
                            
                                <Input type='text' placeholder='Nombre' onChange={handleChange} />
                            </InputGroup>
                        </label>


                        <label className="block text-xl pt-5 Si font-medium text-gray-700" htmlFor="description">
                            Descripción:
                            <InputGroup>
                                
                                <Input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type='text' 
                                placeholder='Nombre' 
                                id="description"
                                onChange={handleChange} 
                                name="description"
                                />
                            </InputGroup>
                            
                        </label>

                        <label className="block text-xl pt-5 font-medium text-gray-700" htmlFor="vacant">
                            Sueldo Base:
                            <InputGroup>
                                <Input type='text' 
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
