'use client'
import React, { useCallback, useState } from 'react'
import { Button, IconButton, Input, Heading, InputGroup, Box, InputLeftElement } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, } from '@chakra-ui/react'
import { Tag, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/react'
import { text } from 'stream/consumers'

const Sueldo = () => {
    
    const sueldo = [
        {
            _id: 1,

            concepto: "Sueldo",
            monto: "2500000",
            iva: `${229000}`,

        },{
            _id: 2,

            concepto: "Adelanto",
            monto: "-250000",
            iva: "0",

        }
    ]

    return (
        <>
            <div className="flex justify-between px-5 mt-2 mb-3">
                <div className="flex gap-2">
                    <Button fontSize={12} borderRadius='full' background='pink.600' onClick={()=>{
                        console.log("sueldo")
                    }}>Sueldo</Button>
                    <Button fontSize={12} borderRadius='full' background='pink.100' onClick={()=>{
                        console.log("adelanto")
                    }}>Adelanto</Button>
                    <Button fontSize={12} borderRadius='full' background='pink.100'>Aguinaldo</Button>
                </div>

            </div>
            <div className="flex justify-between px-5 mt-3 mb-3">
                <h1 className=" text-6xl">Sueldos</h1>
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
            
            <div className="px-5" >

                <TableContainer >

                    <Table variant='simple' >
                        <Thead>
                            <Tr>

                                <Th>Concepto</Th>
                                <Th >Monto</Th>
                                <Th >IVA</Th>
                                <Th >Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                sueldo.map(sueldo => (
                                    <Tr key={sueldo._id}>

                                        <Td className=' py-1'>{sueldo.concepto}</Td>
                                        <Td className=' py-1'>{sueldo.monto}</Td>
                                        <Td className=' py-1'>{sueldo.iva}</Td>
                                        <Td className='flex gap-1 px-4 py-1'>
                                            <IconButton aria-label='Editar' colorScheme='teal' icon={<EditIcon />} />
                                            <IconButton aria-label='borrar' colorScheme='red'  icon={<DeleteIcon />} />


                                        </Td>
                                    </Tr>)
                                )
                            }
                        </Tbody>
                        <Tfoot>

                        </Tfoot>
                    </Table>
                </TableContainer>
            </div>
            <div className="flex justify-end px-5 mt-2 mb-5">
                <div className="flex flex-col font-semibold text-[17px] gap-2">
                    <div className="flex justify-end">
                        <span>TOTAL:</span>
                        <div className="min-w-40 text-right">{sueldo.map(s=>Number(s.monto)).reduce((a,b)=>a+b)} Gs</div>
                    </div>
                    <div className="flex justify-end">
                        <span>IVA:</span>
                        <div className="min-w-40 text-right">{sueldo.map(s=>Number(s.iva)).reduce((a,b)=>a+b)} Gs</div>
                    </div>
                    <div className="flex justify-end">
                        <span>NETO:</span>
                        <div className="min-w-40 text-right">{sueldo.map(s=>Number(s.monto)).reduce((a,b)=>a+b) - sueldo.map(s=>Number(s.iva)).reduce((a,b)=>a+b)} Gs</div>
                    </div>
                </div>
            </div>
        </>


    );
};

export default Sueldo