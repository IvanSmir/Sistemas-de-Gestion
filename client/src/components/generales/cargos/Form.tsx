import React, { ChangeEvent, FormEvent, useState } from "react";

interface FormValues {
    name: string;
    description: string;
    vacant: number;
}

export const Form: React.FC = () => {
    const [formData, setFormData] = useState<FormValues>(
        {
            name: "",
            description: "",
            vacant: 0,
        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        setFormData({ ...formData, [target.name]: target.value });
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, description, vacant } = e.currentTarget;
        setFormData(formData);
        console.log(formData);

    };

    return (
        <form className="flex flex-col items-center justify-center min-h-screen " onSubmit={handleSubmit}>
            <div className="flext justify-center w-full max-w-3xl p-8 bg-white shadow-md rounded-lg">

                <div className="grid grid-cols-2 gap-6">
                    <div>

                        <label className="block text-xl font-medium text-gray-700" htmlFor="name">
                            Nombre:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="name"
                                name="name"
                                required
                            />
                        </label>


                        <label className="block text-xl font-medium text-gray-700" htmlFor="description">
                            Descripción:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="text"
                                id="description"
                                name="description"
                            />
                        </label>

                        <label className="block text-xl font-medium text-gray-700" htmlFor="vacant">
                            Vacante:
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                type="number"
                                id="vacant"
                                name="vacant"
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
