import React, { useEffect, useState } from "react";

interface Asistencia {
  id: number;
  ruc: string;
  nombre: string;
  cargo: string;
  asistencia: string;
  fechaEntrada: string;
  horaEntrada: string;
}

export const List: React.FC = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('asistencias') || '[]');
    setAsistencias(data);
  }, []);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta asistencia?");
    if (confirmed) {
      const updatedAsistencias = asistencias.filter(asistencia => asistencia.id !== id);
      setAsistencias(updatedAsistencias);
      localStorage.setItem('asistencias', JSON.stringify(updatedAsistencias));
      console.log("Eliminar asistencia con ID:", id);
    }
  };
  const handleEdit = (id:number) => {
  };
    return (
      <div className="flex justify-center">
        <div>
          <h2 className="text-xl font-bold mb-4">Lista de Asistencias</h2>
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-1/6 border border-gray-300 py-1 px-2">RUC</th>
                <th className="w-1/6 border border-gray-300 py-1 px-2">Nombre</th>
                <th className="w-1/6 border border-gray-300 py-1 px-2">Cargo</th>
                <th className="w-1/6 border border-gray-300 py-1 px-2">Asistencia</th>
                <th className="w-1/6 border border-gray-300 py-1 px-2">Fecha</th>
                <th className="w-1/6 border border-gray-300 py-1 px-2">Hora</th> 
                <th className="w-1/6 border border-gray-300 py-1 px-2">Acciones</th> 
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia: Asistencia) => (
                <tr key={asistencia.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-1 px-2">{asistencia.ruc}</td>
                  <td className="border border-gray-300 py-1 px-2">{asistencia.nombre}</td>
                  <td className="border border-gray-300 py-1 px-2">{asistencia.cargo}</td>
                  <td className="border border-gray-300 py-1 px-2">{asistencia.asistencia}</td>
                  <td className="border border-gray-300 py-1 px-2">{asistencia.fechaEntrada}</td>
                  <td className="border border-gray-300 py-1 px-2">{asistencia.horaEntrada}</td> 
                  <td className="border border-gray-300 py-1 px-2 flex space-x-2">
                    <button onClick={() => handleEdit(asistencia.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">Editar</button>
                    <button onClick={() => handleDelete(asistencia.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Eliminar</button>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
    
};

