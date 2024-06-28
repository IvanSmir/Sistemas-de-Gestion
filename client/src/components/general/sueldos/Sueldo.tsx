'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, IconButton, Input, Heading, InputGroup, Box, InputLeftElement, useToast } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, } from '@chakra-ui/react'
import { Tag, TagLabel, TagLeftIcon, TagRightIcon } from '@chakra-ui/react'
import { PDFDownloadLink } from '@react-pdf/renderer';
import SueldoPDF from './SueldoPDF';
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter, useParams } from 'next/navigation'
import { generateBonusPayrollDetails, generateIpsPayrollDetails, getPayroll, getPayrollDetail, salaryPayrollDetails, verifyPayrollDetails } from '@/utils/payroll'
import { getEmployeeByTerm } from '@/utils/employee.http'
import { IoMdArrowRoundBack } from 'react-icons/io'

const Sueldo = () => {

    const sueldo1 = [
        {
            _id: "1",
            concepto: "Sueldo",
            ingreso: "2500000",
            egreso: "0",
        }
    ]

    const params = useParams()
    const router = useRouter();

    const [isVerified, setIsVerified] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isClosed, setIsClosed] = useState(false);
    const [sueldo, setSueldo] = useState(sueldo1);
    const [employeeId, setEmployeeId] = useState("");
    const [refresh, setRefresh] = useState(false)
    const [receiptNumber, setReceiptNumber] = useState("");
    const [employee, setEmployee] = useState({
        ciRuc: '',
        name: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const periodsId = `${params.periodsId}`
    const { user } = useAuth();

    useEffect(() => {
        getPayroll(periodsId ?? "", user?.token ?? "")
            .then((a) => {
                console.log(a)
                setIsClosed(a.isEnded)
            })
    }, [periodsId, user?.token])

    const detailsId = `${params.detailsId}`

    useEffect(() => {
        toast.closeAll();
        toast({
            title: 'Cargando',
            description: 'Por favor espere...',
            status: 'loading',
            duration: null,
            isClosable: true,
        });
        getPayrollDetail(periodsId ?? "", detailsId ?? '', user?.token ?? "")
            .then((a) => {
                console.log(a)
                setSueldo(a.payrollItems.map((pi: { id: string; isIncome: boolean; amount: number; description: string }) => ({
                    _id: pi.id,
                    concepto: pi.description,
                    ingreso: pi.isIncome ? pi.amount.toFixed(0) : "0",
                    egreso: pi.isIncome ? "0" : pi.amount.toFixed(0),
                })))
                setReceiptNumber(a.receiptNumber)
                setIsVerified(a.isVerified)
                setEmployeeId(a.employeeId)
                toast.closeAll();
                toast({
                    title: 'Cargado',
                    description: 'El detalle de sueldo ha sido cargado correctamente.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            })
    }, [periodsId, refresh, user?.token, detailsId, toast])

    useEffect(() => {
        if (employeeId.length > 1) {
            getEmployeeByTerm(employeeId, user?.token ?? '')
                .then(e => {
                    console.log(e)
                    setEmployee({
                        ciRuc: e.person.ciRuc ?? '',
                        name: e.person.name ?? ''
                    })
                })
        }
    }, [employeeId, user?.token])

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

    const handleClickIps = () => {
        setIsLoading(true);
        try {
            toast({
                title: 'Generando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            generateIpsPayrollDetails(periodsId, detailsId, user?.token ?? '')
                .then(a => {
                    console.log("retorno de generar ips" + a)
                    toast.closeAll();
                    setRefresh(!refresh)
                    toast({
                        title: 'IPS Generado',
                        description: 'El proceso ha sido culminado con exito.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                })
        } catch {
            toast({
                title: 'Error',
                description: 'No se pudo procesar la peticion.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleClickBonus = () => {
        setIsLoading(true);
        try {
            toast({
                title: 'Generando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            generateBonusPayrollDetails(periodsId, detailsId, user?.token ?? '')
                .then(a => {
                    console.log("retorno de generar bonus" + a)
                    setRefresh(!refresh)
                    toast.closeAll();
                    toast({
                        title: 'Bonus Generado',
                        description: 'El proceso ha sido culminado con exito.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });

                })
        } catch {
            toast({
                title: 'Error',
                description: 'No se pudo procesar la peticion.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleClickSalary = () => {
        setIsLoading(true);
        try {
            toast.closeAll();
            toast({
                title: 'Generando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            salaryPayrollDetails(periodsId, employeeId, user?.token ?? '')
                .then(a => {
                    console.log("retorno de generar bonus" + a)
                    toast.closeAll();
                    toast({
                        title: 'Salario Generado',
                        description: 'El proceso ha sido culminado con exito.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    setRefresh(!refresh)
                })
        } catch {
            toast({
                title: 'Error',
                description: 'No se pudo procesar la peticion.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerification = () => {
        setIsLoading(true);
        try {
            toast({
                title: 'Verificando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            verifyPayrollDetails(periodsId, detailsId, user?.token ?? '')
                .then(a => {
                    console.log("retorno de payroll verification", a)
                    setIsVerified(true);
                    toast.closeAll();
                    toast({
                        title: 'Verificado',
                        description: 'El proceso ha sido verificado.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,

                    });
                })
        } catch {
            toast({
                title: 'Error',
                description: 'No se pudo verificar la nómina.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosure = () => {
        if (sueldo.length > 0) {
            toast({
                title: 'Informacion',
                description: 'Debes cerrar el Periodo, y podras generar el pdf.',
                status: 'info',
                duration: 10000,
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

    const handleBack = () => {
        router.back();
    }

    return (
        <>
            <Box width={{ base: "98%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }}>
                <Box backgroundColor="white" borderRadius="2xl" padding="8px" >
                    <Button onClick={handleBack} background='gray.100'><IoMdArrowRoundBack /></Button>

                    <div className=" w-full flex justify-end px-5 mt-2 mb-3">
                        {!isClosed && (
                            <div className="flex gap-2">

                                <Button fontSize={12} borderRadius='full' background='pink.100' isDisabled={isLoading} onClick={handleClickIps}>Generar IPS</Button>
                                <Button fontSize={12} borderRadius='full' background='pink.100' isDisabled={isLoading} onClick={handleClickBonus}>G. Bonificacion</Button>
                                <Button fontSize={12} borderRadius='full' background='pink.200' isDisabled={isLoading} onClick={handleClickSalary}>Generar sueldo</Button>
                            </div>)}
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
                                <Input type='search' value={employee.name} width={200} disabled placeholder='Nombre' id='nombre' name='nombre' />
                            </div>
                            <div className="flex flex-col">
                                <span>CI:</span>
                                <Input type='search' value={employee.ciRuc.replaceAll(".", "")} width={200} disabled placeholder='CI' id='ci' name='ci' />
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
                                        <Th textAlign="center">Ingresos</Th>
                                        <Th textAlign="center">Egresos</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        sueldo.map(sueldo => (
                                            <Tr key={sueldo._id}>
                                                <Td padding="5" textAlign="left">{(sueldo.concepto)}</Td>
                                                <Td padding="5" paddingRight={40} marginRight={20} textAlign="right">{(+sueldo.ingreso).toLocaleString('es-ES')}</Td>
                                                <Td padding="5" paddingRight={40} marginRight={20} textAlign="right">{(+sueldo.egreso).toLocaleString('es-ES')}</Td>
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
                                <div className="min-w-40 text-right">{sueldo.map(s => Number(s.ingreso)).reduce((a, b) => a + b, 0).toLocaleString('es-ES')} Gs</div>
                            </div>
                            <div className="flex justify-end">
                                <span>TOTAL EGRESOS:</span>
                                <div className="min-w-40 text-right">{sueldo.map(s => Number(s.egreso)).reduce((a, b) => a + b, 0).toLocaleString('es-ES')} Gs</div>
                            </div>
                            <div className="flex justify-end">
                                <span> TOTAL A PAGAR:</span>
                                <div className="min-w-40 text-right">{(sueldo.map(s => Number(s.ingreso)).reduce((a, b) => a + b, 0) - sueldo.map(s => Number(s.egreso)).reduce((a, b) => a + b, 0)).toLocaleString('es-ES')} Gs</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end px-20 mt-2 mb-5">
                        {!isVerified && (
                            <Button backgroundColor={'#e4b1bc'} isDisabled={isLoading} onClick={handleVerification}>Verificado</Button>
                        )}
                        {isVerified && !isClosed && (
                            <Button backgroundColor={'#e4b1bc'} onClick={handleClosure}>Generar PDF</Button>
                        )}
                        {isClosed && (
                            <PDFDownloadLink
                                document={<SueldoPDF sueldo={sueldo} currentDate={selectedDate} employee={employee} receiptNumber={receiptNumber} />}
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
