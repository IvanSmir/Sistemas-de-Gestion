'use client'

import Image from "next/image";
import { ChangeEvent, useState } from 'react';
import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import Employee from "@/types/employee";


export const FormEmployee: React.FC = () => {
    const [employee, setEmployee] = useState<Employee>(
        {
            name: "",
            email: "",
            image: "",
            gender: "",
            address: "",
            phone: " ",
            ruc: "",
            joinDate: new Date(),
            birthdate: new Date()
        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let value = target.value;
        setEmployee({ ...employee, [target.name]: value });
    };
    return (
        <form>
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
                                value={employee.name}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">
                                Correo:
                            </FormLabel>

                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="email"
                                id="email"
                                onChange={handleChange}

                                value={employee.email}
                                name="email"
                            />
                        </FormControl>
                    </div>
                    <FormControl>
                        <FormLabel htmlFor="address">Dirección:
                        </FormLabel>

                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="address"
                            onChange={handleChange}

                            value={employee.address}
                            name="address"
                        />
                    </FormControl>
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="gender">Sexo:
                            </FormLabel>

                            <Select
                                id="gender"
                                name="gender"
                                value={employee.gender}
                                placeholder='Seleccione el sexo'
                                onChange={handleChange}
                            >
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="ruc">
                                RUC:
                            </FormLabel>

                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="ruc"
                                onChange={handleChange}

                                value={employee.ruc}
                                name="ruc"
                            />
                        </FormControl>
                    </div>
                    <div className="flex gap-4">
                        <FormControl>
                            <FormLabel htmlFor="joinDate">
                            </FormLabel>

                            Fecha de Incorporación:
                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="joinDate"
                                onChange={handleChange}
                                value={employee.joinDate.toString()}
                                name="joinDate"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="birthdate">
                                Fecha de Nacimiento:
                            </FormLabel>

                            <Input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="date"
                                id="birthdate"
                                onChange={handleChange}

                                value={employee.birthdate.toString()}
                                name="birthdate"
                            />
                        </FormControl>
                    </div>
                    <FormControl>
                        <FormLabel htmlFor="phone">
                            Teléfono:
                        </FormLabel>

                        <Input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            type="text"
                            id="phone"
                            onChange={handleChange}
                            value={employee.phone}
                            name="phone"
                        />
                    </FormControl>
                </div>
                <div className="w-1/4 gap-4">
                    <FormControl>


                        <FormLabel htmlFor='image'>Foto de Perfil: </FormLabel>
                        <div className="flex flex-col h-56 justify-center">
                            <div className="flex justify-center">
                                <Image
                                    className="object-cover bg-no-repeat"
                                    src="/subir.png"
                                    alt="subir.png"
                                    width={128}
                                    height={128}
                                />
                            </div>
                            <Input
                                type="text"
                                id="image"
                                name="image"
                                value={employee.image}
                                onChange={handleChange}
                            />
                            <Button
                                mt={4}
                                colorScheme='gray'
                            >Subir Imagen</Button>

                        </div>
                    </FormControl>

                </div>

            </div>
        </form >
    )
}