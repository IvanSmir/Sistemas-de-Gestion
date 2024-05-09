import { Form } from '@/components/funcionarios/Form';
import React, { useState } from 'react';
import { BtnAdd} from '@/components/funcionarios/btnAdd';
import { BtnEdit} from '@/components/funcionarios/btnEdit';
import { BtnDelete} from '@/components/funcionarios/btnDelete';
import '../../app/globals.css'
import Layout from '../../app/layout'

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
} from '@chakra-ui/react'

const index = () => {
  const funcionarios= [
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
const [rucFuncionarioEditado,setRucFuncionarioEditado] = useState(null);

const abrirFormulario = () => {
  setMostrarFormulario(true);
};

const editarFuncionario=(ruc: React.SetStateAction<null>)=>{
  setRucFuncionarioEditado(ruc);
  setMostrarFormulario(true);
}

  return (
    <Layout>
      <TableContainer>
  <Table variant='simple'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>inches</Td>
        <Td>millimetres (mm)</Td>
        <Td isNumeric>25.4</Td>
      </Tr>
      <Tr>
        <Td>feet</Td>
        <Td>centimetres (cm)</Td>
        <Td isNumeric>30.48</Td>
      </Tr>
      <Tr>
        <Td>yards</Td>
        <Td>metres (m)</Td>
        <Td isNumeric>0.91444</Td>
      </Tr>
    </Tbody>
    <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
      <div className="flex  flex-row-reverse mr-8 ">
        <BtnAdd onClick={abrirFormulario}/>
      </div>

      <div className="flex justify-center">
        {mostrarFormulario && <Form />}
      </div>
      
      <div className="flex justify-center">
      <table className='table-auto w-full m-8'>
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
          );})}
          </tbody>
        </table>
      </div>
    </Layout>
    
  )
}
export default index;