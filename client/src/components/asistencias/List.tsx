import React from "react";

interface Asistencia {
    id: number;
    ruc: string;
    nombre: string;
    cargo: string;
    asistencia: string;
    fecha: string;
}

export const List: React.FC = () => {
    // Datos de prueba
    const asistencias: Asistencia[] = [
        { id: 1, ruc: "123456789", nombre: "Juan", cargo: "Secretario", asistencia: "Presente", fecha: "2024-05-01" },
        { id: 2, ruc: "987654321", nombre: "Maria", cargo: "Vendedora", asistencia: "Ausente", fecha: "2024-05-02" },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold">Lista de Asistencias</h2>
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="w-1/5 border border-gray-300 py-2 px-4">RUC</th>
                        <th className="w-1/5 border border-gray-300 py-2 px-4">Nombre</th>
                        <th className="w-1/5 border border-gray-300 py-2 px-4">Cargo</th>
                        <th className="w-1/5 border border-gray-300 py-2 px-4">Asistencia</th>
                        <th className="w-1/5 border border-gray-300 py-2 px-4">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map((asistencia: Asistencia) => (
                        <tr key={asistencia.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 py-2 px-4">{asistencia.ruc}</td>
                            <td className="border border-gray-300 py-2 px-4">{asistencia.nombre}</td>
                            <td className="border border-gray-300 py-2 px-4">{asistencia.cargo}</td>
                            <td className="border border-gray-300 py-2 px-4">{asistencia.asistencia}</td>
                            <td className="border border-gray-300 py-2 px-4">{asistencia.fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


