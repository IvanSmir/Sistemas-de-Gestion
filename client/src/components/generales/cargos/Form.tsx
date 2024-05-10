'use client'
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import Pagination from "./Pagination"; 
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
        
        <form className="flex flex-col items-center justify-center min-h-screen " onSubmit={handleSubmit}>
            <div className="flext justify-center w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">
            <Pagination/>
                <div className="grid grid-cols-2 gap-6">
                    <div>

                        <label className="block text-xl font-medium text-gray-700" htmlFor="name">
                            Nombre:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                required
                            />
                        </label>


                        <label className="block text-xl font-medium text-gray-700" htmlFor="description">
                            Descripción:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="description"
                                onChange={handleChange}
                                name="description"
                            />
                        </label>

                        <label className="block text-xl font-medium text-gray-700" htmlFor="vacant">
                            Sueldo Base:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="number"
                                id="vacancies"
                                onChange={handleChange}
                                name="vacancies"
                            />
                        </label>

                        <div className="flex justify-center mt-6">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full" type="submit">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>


    );

};
