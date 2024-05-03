import React, { FormEvent, useState } from "react";
import { useRouter } from 'next/router';

interface FormValues {
    ruc: string;
    fechaEntrada: string;
    horaEntrada: string;
    observaciones: string;
}

export const Form: React.FC = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<FormValues>({
        ruc: "",
        fechaEntrada: "",
        horaEntrada: "",
        observaciones: "",
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const asistencias = JSON.parse(localStorage.getItem('asistencias') || '[]');
        const newAsistencia = {
            id: asistencias.length + 1,
            ...formData,
            asistencia: "Presente",
        };
        localStorage.setItem('asistencias', JSON.stringify([...asistencias, newAsistencia]));
        router.push('/listarAsistencias'); // Redirigir a la página de listarAsistencias
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCancel = () => {
        router.push('/listarAsistencias');
    };

    return (
        <div className="flex justify-center h-screen items-center text-black bg-gray-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Registro de Asistencia
                </h2>
                <div className="mb-4">
                    <label htmlFor="ruc" className="block mb-1">
                        RUC:
                    </label>
                    <input
                        type="text"
                        id="ruc"
                        name="ruc"
                        value={formData.ruc}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                        placeholder="RUC"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fechaEntrada" className="block mb-1">
                        Fecha de Entrada:
                    </label>
                    <input
                        type="date"
                        id="fechaEntrada"
                        name="fechaEntrada"
                        value={formData.fechaEntrada}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="horaEntrada" className="block mb-1">
                        Hora de Entrada:
                    </label>
                    <input
                        type="time"
                        id="horaEntrada"
                        name="horaEntrada"
                        value={formData.horaEntrada}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="observaciones" className="block mb-1">
                        Observaciones:
                    </label>
                    <textarea
                        id="observaciones"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Observaciones"
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mr-2" onClick={handleCancel}>Cancelar</button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};





