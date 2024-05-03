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
            <th className="w-1/5 border border-gray-300 py-2 px-4">Hora</th> 
            <th className="w-1/5 border border-gray-300 py-2 px-4">Acciones</th> 
          </tr>
        </thead>
        <tbody>
          {asistencias.map((asistencia: Asistencia) => (
            <tr key={asistencia.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 py-2 px-4">{asistencia.ruc}</td>
              <td className="border border-gray-300 py-2 px-4">{asistencia.nombre}</td>
              <td className="border border-gray-300 py-2 px-4">{asistencia.cargo}</td>
              <td className="border border-gray-300 py-2 px-4">{asistencia.asistencia}</td>
              <td className="border border-gray-300 py-2 px-4">{asistencia.fechaEntrada}</td>
              <td className="border border-gray-300 py-2 px-4">{asistencia.horaEntrada}</td> 
              <td className="border border-gray-300 py-2 px-4">
                <button onClick={() => handleEdit(asistencia.id)}>Editar</button> 
                <button onClick={() => handleDelete(asistencia.id)}>Eliminar</button> 
              </td> {/* Mostrar las acciones */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

