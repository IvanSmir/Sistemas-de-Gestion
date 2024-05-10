'use client'
import { Form } from '@/components/funcionarios/Form';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Container
  } from '@chakra-ui/react'
export const ListaFuncionarios = () => {
    // const funcionarios = [
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',


    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },
    //     {
    //         ruc: "1045555-3",
    //         nombre: 'Adrian Grahl',
    //         cargo: "Gerente",
    //         fechaNac: '20/01/2000',
    //     },]

    const [funcionarios, setFuncionarios] = useState([]);
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await axios.get('http://localhost:3002/employees')
                setFuncionarios(response.data)
            }
            fetchData()
            console.log(funcionarios)
        } catch (error) {
            console.log(error)
        }
    }, [])
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
        <>
            <h1 className='text-6xl'>
                Funcionarios
            </h1>


            <div className="flex justify-between items-center">
                <Link href={'/funcionarios/add'}><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Crear Funcionario</button></Link>

            </div>

            <div className="flex justify-center">
                {mostrarFormulario && <Form />}
            </div>

            <Container >
                <table className='table-auto w-full'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>Ruc</th>
                            <th className='px-4 py-2'>Nombre</th>
                            <th className='px-4 py-2'>Email</th>
                            <th className='px-4 py-2'>Numero de telefono</th>
                            <th className='px-4 py-2'>Direccion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((funcionario: any) => {
                            return (
                                <tr key={funcionario.id}>
                                    <td className='border px-4 py-2'>{funcionario.ruc}</td>
                                    <td className='border px-4 py-2'>{funcionario.name}</td>
                                    <td className='border px-4 py-2'>{funcionario.email}</td>
                                    <td className='border px-4 py-2'>{funcionario.phone}</td>
                                    <td className='border px-4 py-2'>{funcionario.direction}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Container>
        </>
    )
}
