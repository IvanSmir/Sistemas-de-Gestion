'use client'
import { Form } from '@/components/funcionarios/Form';
import React, { useState } from 'react';
import { BtnAdd } from '@/components/funcionarios/BtnAdd';
import { BtnEdit } from '@/components/funcionarios/BtnEdit';
import { BtnDelete } from '@/components/funcionarios/BtnDelete';

import '../../app/globals.css'
import Layout from '../../app/layout'
const Index = () => {
    const funcionarios = [
        {
            ruc: "1045555-3",
            nombre: 'Adrian Grahl',
            cargo: "Gerente",
            fechaNac: '20/01/2000',
        },
        {
            ruc: "1045555-3",
            nombre: 'Adrian Grahl',
            cargo: "Gerente",
            fechaNac: '20/01/2000',


        },
        {
            ruc: "1045555-3",
            nombre: 'Adrian Grahl',
            cargo: "Gerente",
            fechaNac: '20/01/2000',
        },
        {
            ruc: "1045555-3",
            nombre: 'Adrian Grahl',
            cargo: "Gerente",
            fechaNac: '20/01/2000',
        },
        {
            ruc: "1045555-3",
            nombre: 'Adrian Grahl',
            cargo: "Gerente",
            fechaNac: '20/01/2000',
        },]

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [rucFuncionarioEditado, setRucFuncionarioEditado] = useState(null);

    const abrirFormulario = () => {
        setMostrarFormulario(true);
    };

    const editarFuncionario = (ruc: React.SetStateAction<null>) => {
        setRucFuncionarioEditado(ruc);
        setMostrarFormulario(true);
    }

    return (
        <Layout>


            <div className="flex justify-between items-center">
                <BtnAdd onClick={abrirFormulario} />
            </div>

            <div className="flex justify-center">
                {mostrarFormulario && <Form />}
            </div>

            <div className="flex justify-center">
                <table className='table-auto w-full'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>Ruc</th>
                            <th className='px-4 py-2'>Nombre</th>
                            <th className='px-4 py-2'>Cargo</th>
                            <th className='px-4 py-2'>Fecha Nacimiento</th>
                            <th className='px-4 py-2'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((funcionario) => {
                            return (
                                <tr key={funcionario.ruc}>
                                    <td className='border px-4 py-2'>{funcionario.ruc}</td>
                                    <td className='border px-4 py-2'>{funcionario.nombre}</td>
                                    <td className='border px-4 py-2'>{funcionario.cargo}</td>
                                    <td className='border px-4 py-2'>{funcionario.fechaNac}</td>
                                    <td className='border px-4 py-2'>
                                        <div>

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>

    )
}
export default Index;