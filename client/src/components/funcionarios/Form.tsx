import React, { FormEvent, useState } from "react";

interface FormValues {
  name: string;
  email: string;
  
}

export const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({ name: "", email: ""});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email } = e.currentTarget;
    if (name && email) {
      const formData: FormValues = {
        name: name.value,
        email: email.value,


      };
      setFormData(formData);
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
           Imagen:

           <input type="file" id="image" name="image" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>

            </label>
            <label htmlFor="name" className="block text-sm font-medium min text-gray-700">
              Nombre:
              <input type="text" id="name" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Sexo:
              <select id="gender" name="gender" className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              <option className="" value="">Seleccione el sexo</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </label>
            <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
              Dirección:
              <input type="text" id="direction" name="direction" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
            <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">
              RUC:
              <input type="text" id="ruc" name="ruc" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
          </div>
          <div>
          <label htmlFor="ingreso" className="block text-sm font-medium text-gray-700">
              Fecha de ingreso:
              <input type="date" id="ingreso" name="ingreso" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento:
              <input type="date" id="birthday" name="birthday" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Teléfono:
              <input type="text" id="text" name="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo:
              <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
            </label>
           
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
            Enviar
          </button>
        </div>
      </div>
    </form>
  );
  
};
