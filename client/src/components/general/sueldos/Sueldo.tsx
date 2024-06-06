'use client'
import React, { useCallback, useState } from 'react'
import { Button, IconButton, Input, Heading, InputGroup, Box, InputLeftElement, useToast } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, } from '@chakra-ui/react'
import { Tag, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/react'
import { text } from 'stream/consumers'
import { PDFDownloadLink } from '@react-pdf/renderer';
import SueldoPDF from './SueldoPDF';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/context/AuthProvider";

const Sueldo = () => {

    const [isVerified, setIsVerified] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isClosed, setIsClosed] = useState(false);
    const toast = useToast();

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = new Date(event.target.value);
        // Comprobar si la fecha seleccionada es anterior a la fecha actual
        if (selected < new Date()) {
            toast({
                title: 'Error',
                description: 'La fecha no puede ser anterior a hoy.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setSelectedDate(selected);
    };

    const handleVerification = () => {
        setIsVerified(true);
        toast({
            title: 'Verificado',
            description: 'El proceso ha sido verificado.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const sueldo = [
        {
            _id: "1",

            concepto: "Sueldo",
            ingreso: "2500000",
            egreso: "0",

        },
        {
            _id: "2",
            concepto: "Bonificacion",
            ingreso: "50000",
            egreso: "0",
        },
        {
            _id: "3",
            concepto: "Adelanto",
            ingreso: "0",
            egreso: "700000",

        },
        {
            _id: "4",

            concepto: "Retiro",
            ingreso: "0",
            egreso: "15000",

        },
    ]



    const handleClosure = () => {
        if (sueldo.length > 0) {
            setIsClosed(true);
            toast({
                title: 'Exito',
                description: 'El proceso ha sido cerrado.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Error',
                description: 'No hay ingresos y egresos registrados.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }


    return (
        <>
            <Box width={{ base: "98%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }}>
                <Box backgroundColor="white" borderRadius="2xl" padding="8px" marginTop={6}>
                    <div className="flex justify-between px-5 mt-2 mb-3">
                        <div className="flex gap-2">
                            <Button fontSize={12} borderRadius='full' background='pink.100' onClick={() => {
                                console.log("bonificacion")
                            }}>Volver</Button>
                            <Button fontSize={12} borderRadius='full' background='pink.200' onClick={() => {
                                console.log("general sueldo")
                            }}>Cierre-sueldo</Button>

                        </div>

                    </div>
                    <div className="flex justify-between px-5 mt-3 mb-3">
                        <h1 className=" text-2xl">Detalle de Sueldo</h1>
                        <div className="flex  items-center gap-3">
                            <span>Fecha:</span>
                            <Input placeholder='Select Date and Time' width={200} size='md' type='datetime-local'
                                value={selectedDate.toISOString().substring(0, 16)} // Mostrar la fecha seleccionada
                                onChange={handleDateChange}
                                max={new Date().toISOString().substring(0, 16)}
                            />
                        </div>
                    </div>
                    <div className="px-5 flex flex-col gap-2 mb-2">
                        <div className='flex gap-5 items-center'>
                            <span className="font-semibold text-[18px]">Funcionario:</span>
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
                                        <Th >Ingresos</Th>
                                        <Th >Egresos</Th>
                                        {/* <Th >Acciones</Th> */}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        sueldo.map(sueldo => (
                                            <Tr key={sueldo._id}>

                                                <Td className=' py-1'>{sueldo.concepto}</Td>
                                                <Td className=' py-1'>{sueldo.ingreso}</Td>
                                                <Td className=' py-1'>{sueldo.egreso}</Td>
                                                {/* <Td className='flex gap-1 px-4 py-1'>
                                            <IconButton aria-label='Editar' colorScheme='white' icon={<EditIcon color={'gray'}/>} />
                                            <IconButton aria-label='borrar' colorScheme='white'  icon={<DeleteIcon color={'gray'}/>} />
                                         </Td>   
                                            */}


                                            </Tr>)
                                        )
                                    }
                                </Tbody>
                                <Tfoot>

                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="flex justify-end px-20 mt-2 mb-5">
                        <div className="flex flex-col font-semibold text-[17px] gap-2">
                            <div className="flex justify-end">
                                <span>TOTAL INGRESOS:</span>
                                <div className="min-w-40 text-right">{sueldo.map(s => Number(s.ingreso)).reduce((a, b) => a + b)} Gs</div>
                            </div>
                            <div className="flex justify-end">
                                <span>TOTAL EGRESOS:</span>
                                <div className="min-w-40 text-right">{sueldo.map(s => Number(s.egreso)).reduce((a, b) => a + b)} Gs</div>
                            </div>
                            <div className="flex justify-end">
                                <span> TOTAL A PAGAR:</span>
                                <div className="min-w-40 text-right">{sueldo.map(s => Number(s.ingreso)).reduce((a, b) => a + b) - sueldo.map(s => Number(s.egreso)).reduce((a, b) => a + b)} Gs</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end px-20 mt-2 mb-5">
                        {!isVerified && (
                            <Button backgroundColor={'#e4b1bc'} onClick={handleVerification}>Verificar</Button>
                        )}
                        {isVerified && !isClosed && (
                            <Button backgroundColor={'#e4b1bc'} onClick={handleClosure}>Cerrar Proceso</Button>
                        )}
                        {isClosed && (
                            <PDFDownloadLink
                                document={<SueldoPDF sueldo={sueldo} currentDate={selectedDate} />}
                                fileName="sueldo.pdf"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Cargando documento...' : <Button backgroundColor={'#e4b1bc'}>Generar PDF</Button>
                                }
                            </PDFDownloadLink>
                        )}
                    </div>
                </Box>
            </Box>

        </>

    );
};

export default Sueldo


