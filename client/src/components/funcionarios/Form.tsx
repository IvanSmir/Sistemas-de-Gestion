'use client';
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Text, FormControl, Input, FormLabel, Select, Button } from '@chakra-ui/react'


interface FormValues {
  name: string;
  email: string;
  image: string;
  gender: string;
  direction: string;
  ruc: string;
  joinDate: Date;
  birthdate: Date;
  phone: string;


}

export const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>(
    {
      name: "",
      email: "",
      image: "",
      gender: "",
      direction: "",
      phone: " ",
      ruc: "",
      joinDate: new Date(),
      birthdate: new Date()
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    let value = target.value;
    setFormData({ ...formData, [target.name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData(formData);
    console.log(formData);
    try {
      const response = await axios.post("http://localhost:3002/employees", formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <Text
        fontSize='3xl'
        marginLeft='3vw'
        marginBottom='3vh'
      >
        Agregar funcionario</Text>

      <FormControl className="flex justify-center items-center">
        <div className="Container">

          <div className=" divMitad gap-14 flex flex-row">
            <div>

              <div className="grid grid-cols-2 gap-6">
                <FormLabel htmlFor="name" >Nombre:

                  <Input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </FormLabel>
                <FormLabel htmlFor="email">
                  Correo:
                  <Input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="email"
                    id="email"
                    onChange={handleChange}

                    value={formData.email}
                    name="email"
                  />
                </FormLabel>
              </div>

              <FormLabel htmlFor="direction">Dirección:
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  type="text"
                  id="direction"
                  onChange={handleChange}

                  value={formData.direction}
                  name="direction"
                />
              </FormLabel>
              <div className="grid grid-cols-2 gap-6">
                <FormLabel htmlFor="gender">Sexo:

                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    placeholder='Seleccione el sexo'
                    onChange={handleChange}
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </Select>
                </FormLabel>

                <FormLabel htmlFor="ruc">
                  RUC:

                  <Input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="text"
                    id="ruc"
                    onChange={handleChange}

                    value={formData.ruc}
                    name="ruc"
                  />

                </FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-6">

                <FormLabel htmlFor="joinDate">
                  Fecha de Incorporación:

                  <Input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="date"
                    id="joinDate"
                    onChange={handleChange}
                    value={formData.joinDate.toString()}
                    name="joinDate"
                  />
                </FormLabel>
                <FormLabel htmlFor="birthdate">
                  Fecha de Nacimiento:

                  <Input
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    type="date"
                    id="birthdate"
                    onChange={handleChange}

                    value={formData.birthdate.toString()}
                    name="birthdate"
                  />
                </FormLabel>
              </div>
              <FormLabel htmlFor="phone">
                Teléfono:
                <Input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  type="text"
                  id="phone"
                  onChange={handleChange}

                  value={formData.phone}
                  name="phone"
                />
              </FormLabel>
            </div>


            <div className="flex flex-col items-center">
              <FormLabel htmlFor='image'>Foto de Perfil: </FormLabel>
              <div className="flex flex-col h-56 justify-center">
                <Input
                  bgImage={'/image.png'}
                  bgSize='cover'
                  bgRepeat='no-repeat'
                  h="23vh"
                  w="13vw"
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
                <Button
                  mt={4}
                  colorScheme='gray'
                >Subir Imagen</Button>

              </div>

            </div>

          </div>



          <Button
            mt={4}
            colorScheme='gray'
            type='submit'
          >Enviar</Button>
        </div>

      </FormControl>
    </form >


  );
};
