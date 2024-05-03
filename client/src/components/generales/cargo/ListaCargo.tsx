import React from 'react'

const ListaCargo = () => {

    const cargos = [
        {
            _id: 1,
            nombre: "un nombre",
            descripcion: "un cargo con un nombre",
            vacantes: 1

        },
        {
            _id: 2,
            nombre: "dos nombres",
            descripcion: "un cargo con dos nombres",
            vacantes: 2

        },
        {
            _id: 3,
            nombre: "tres nombres",
            descripcion: "un cargo con tres nombres",
            vacantes: 3

        }
    ]

    return <div>
        <h1 className='flex flex-col p-10'>Lista de Cargos</h1>
        <table className='table-auto w-full'>
            <thead>
                <tr>
                    <th className='px-4 py-2'>Nombre</th>
                    <th className='px-4 py-2'>Descripcion</th>
                    <th className='px-4 py-2'>Vacantes</th>
                    <th className='px-4 py-2'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    cargos.map(cargo => (
                        <tr key={cargo._id}>
                            <td className='border px-4 py-2'>{cargo.nombre}</td>
                            <td className='border px-4 py-2'>{cargo.descripcion}</td>
                            <td className='border px-4 py-2'>{cargo.vacantes}</td>
                            <td className='border px-4 py-2'> Button y FontAwesomeIcon </td>
                        </tr>)
                    )
                }
            </tbody>
        </table>
    </div>
}
export default ListaCargo
