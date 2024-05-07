'use client';
import axios from "axios";
import React, { ChangeEvent, FormEvent, useState } from "react";

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
    <form className="flex flex-col items-center justify-center min-h-screen" onSubmit={handleSubmit}>
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-medium text-gray-700" htmlFor="image">
              Imagen:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="name">
              Nombre:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="gender">
              Sexo:
              <select
                className="mt-1 block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-xl outline-2 placeholder:text-gray-500"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seleccione el sexo</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="direction">
              Dirección:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                id="direction"
                onChange={handleChange}

                value={formData.direction}
                name="direction"
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="ruc">
              RUC:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                id="ruc"
                onChange={handleChange}

                value={formData.ruc}
                name="ruc"
              />
            </label>
          </div>

          <div>
            <label className="block text-xl font-medium text-gray-700" htmlFor="joinDate">
              Fecha de Incorporación:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="date"
                id="joinDate"
                onChange={handleChange}
                value={formData.joinDate.toString()}
                name="joinDate"
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="birthdate">
              Fecha de Nacimiento:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="date"
                id="birthdate"
                onChange={handleChange}

                value={formData.birthdate.toString()}
                name="birthdate"
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="phone">
              Teléfono:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                id="phone"
                onChange={handleChange}

                value={formData.phone}
                name="phone"
              />
            </label>

            <label className="block text-xl font-medium text-gray-700" htmlFor="email">
              Correo:
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="email"
                id="email"
                onChange={handleChange}

                value={formData.email}
                name="email"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full" type="submit">
            Enviar
          </button>
        </div>
      </div>
    </form>


  );

};
