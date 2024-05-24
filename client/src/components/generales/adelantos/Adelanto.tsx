'use client';
import React from 'react';
import { Button, IconButton, Input } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AdelantoPDF from './AdelantoPDF'; 

interface Adelanto {
    _id: number;
    concepto: string;
    ingreso: string;
    egreso: string;
}

const Adelanto: React.FC = () => {
    const adelanto: Adelanto[] = [
        {
            _id: 1,
            concepto: "Adelanto",
            ingreso: "0",
            egreso: "250000",
        }
    ];

    return (
        <>
            <div className="flex justify-between px-5 mt-2 mb-3">
                <div className="flex gap-2">
                    <Button fontSize={12} borderRadius='full' background='pink.100' onClick={() => {
                        console.log("sueldo")
                    }}>Sueldo</Button>
                    <Button fontSize={12} borderRadius='full' background='pink.100' onClick={() => {
                        console.log("adelanto")
                    }}>Adelanto</Button>
                    <Button fontSize={12} borderRadius='full' background='pink.600'>Aguinaldo</Button>
                </div>
            </div>
            <div className="flex justify-between px-5 mt-3 mb-3">
                <h1 className=" text-6xl">Adelantos</h1>
                <div className="flex  items-center gap-3">
                    <span>Fecha:</span>
                    <Input placeholder='Select Date and Time' width={200} size='md' type='datetime-local' />
                </div>
            </div>
            <div className="px-5 flex flex-col gap-2 mb-2">
                <div className='flex gap-5 items-center'>
                    <span className="font-semibold text-[20px]">Funcionario</span>
                    <div className="border-[1px] border-[#e4b1bc] w-full h-0"></div>
                </div>
                <div className="flex gap-2">
                    <div className="pl-2 flex flex-col">
                        <span>Nombre:</span>
                        <Input type='search' width={200} placeholder='Nombre' />
                    </div>
                    <div className="flex flex-col">
                        <span>CI:</span>
                        <Input type='search' width={200} placeholder='CI' />
                    </div>
                </div>
                <div className="border-[1px] border-[#e4b1bc] w-full h-0 my-2"></div>
            </div>
            <div className="px-5">
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Concepto</Th>
                                <Th>Ingreso</Th>
                                <Th>Egreso</Th>
                                <Th>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {adelanto.map(item => (
                                <Tr key={item._id}>
                                    <Td className='py-1'>{item.concepto}</Td>
                                    <Td className='py-1'>{item.ingreso}</Td>
                                    <Td className='py-1'>{item.egreso}</Td>
                                    <Td className='flex gap-1 px-4 py-1'>
                                        <IconButton aria-label='Editar' colorScheme='white' icon={<EditIcon />} color='#7A7A7A' />
                                        <IconButton aria-label='borrar' colorScheme='white' icon={<DeleteIcon />} color='red' />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </div>
            <div className="flex justify-end px-5 mt-2 mb-5">
                <div className="flex flex-col font-semibold text-[17px] gap-2">
                    <div className="flex justify-end">
                        <span>TOTAL INGRESO:</span>
                        <div className="min-w-40 text-right">{adelanto.map(s => Number(s.ingreso)).reduce((a, b) => a + b)} Gs</div>
                    </div>
                    <div className="flex justify-end">
                        <span>TOTAL EGRESO:</span>
                        <div className="min-w-40 text-right">{adelanto.map(s => Number(s.egreso)).reduce((a, b) => a + b)} Gs</div>
                    </div>
                    <div className="flex justify-end">
                        <span>MONTO:</span>
                        <div className="min-w-40 text-right">{adelanto.map(s => Number(s.egreso)).reduce((a, b) => a + b)} Gs</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-5 mb-5">
                <PDFDownloadLink document={<AdelantoPDF adelanto={adelanto} />} fileName="adelanto.pdf">
                    {({ loading }) => (loading ? <Button>Cargando...</Button> : <Button>Descargar PDF</Button>)}
                </PDFDownloadLink>
            </div>
        </>
    );
};

export default Adelanto;
