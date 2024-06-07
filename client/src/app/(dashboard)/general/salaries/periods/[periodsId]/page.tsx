'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { TableEmployee } from '@/components/lists/TableEmployee';
import { getEmployees } from '@/utils/employee.http';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { getPayrollDetails, createPayments, calculateIpsForAllEmployees, calculateBonificationForAllEmployees, closePayrollPeriod } from '@/utils/salary.http';
import Period from '@/types/period';
import { TableSalaries } from '@/components/general/salaries/List';
import PayrollDetail from '@/types/period';
import GenericModalConfirm from '@/components/general/salaries/Prueba';
import { set } from 'zod';
import IpsModalConfirm from '@/components/general/salaries/BonificacionModal';
import CierreModalConfirm from '@/components/general/salaries/CierreModal';
import BonificacionModalConfirm from '@/components/general/salaries/BonificacionModal';
import GenerarModalConfirm from '@/components/general/salaries/GenerarModal';
import { PayrollPeriod } from '@/types/payments';
import { useRouter, useParams } from 'next/navigation'
import { IoMdArrowRoundBack } from 'react-icons/io';

interface Person {
    ciRuc: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    age?: number;
}

interface Root {
    id: string;
    enterDate: string;
    person: Person;
}

const transformedDate = (fecha: string): number => {

    const today = new Date();
    const birth = new Date(fecha);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    // Ajustar si el cumpleaños aún no ha llegado este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

const transformData = (data: Root[]): Root[] => {
    return data.map(datum => ({
        ...datum,
        person: {
            age: transformedDate(datum.person.birthDate),
            ...datum.person
        }
    }));
};


const ListEmployeePage: React.FC = () => {
    const router = useRouter();

    const toast = useToast();
    const { periodsId } = useParams();
    const auth = useAuth();
    const [payments, setPayments] = useState<PayrollPeriod | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const columnMapping = {
        'Nombre': 'name',
        'CI/RUC': 'ciRuc',
        'Correo Electrónico': 'email',
    };

    const createPayment = async () => {
        setLoading(true);
        try {
            const { user } = auth;
            const token = user?.token || '';
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const data = await createPayments(periodsId as string, token);
            toast.closeAll();
            toast({
                title: "Pago de Salarios",
                description: "El proceso ha sido verificado.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log("dataaaaa", data);
            fetchPayrolls();
        } catch (error) {
            console.error('Error al generar salario:', error);
            toast({
                title: "Error",
                description: "Error al generar el salario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleIps = async () => {
        setLoading(true);
        try {
            const { user } = auth;
            const token = user?.token || '';
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const data = await calculateIpsForAllEmployees(periodsId as string, token);
            console.log(data);
            toast.closeAll();
            toast({
                title: "IPS",
                description: "El proceso ha sido verificado.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchPayrolls();
        } catch (error) {
            console.error('Error al calcular IPS:', error);
            toast({
                title: "Error",
                description: "Error al calcular IPS",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleBonification = async () => {
        setLoading(true);
        try {
            const { user } = auth;
            const token = user?.token || '';
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const data = await calculateBonificationForAllEmployees(periodsId as string, token);
            console.log(data);
            toast.closeAll();
            toast({
                title: "Bonificaciones",
                description: "El proceso ha sido verificado.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchPayrolls();
        } catch (error) {
            console.error('Error al calcular bonificaciones:', error);
            toast({
                title: "Error",
                description: "Error al calcular bonificaciones",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleClosePayroll = async () => {
        setLoading(true);
        try {
            const { user } = auth;
            const token = user?.token || '';
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const data = await closePayrollPeriod(periodsId as string, token);
            console.log(data);
            toast({
                title: "Cerrado",
                description: "El proceso ha sido verificado.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchPayrolls();
        } catch (error) {
            console.error('Error al cerrar periodo:', error);
            toast({
                title: "Error",
                description: "Error al cerrar el periodo",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const fetchPayrolls = useCallback(async () => {
        setLoading(true);
        try {
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const { user } = auth;
            const token = user?.token || '';
            const data = await getPayrollDetails(periodsId as string, token);
            toast.closeAll();
            toast({
                title: "Cargado",
                description: "Datos de salario cargados con éxito",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            console.log("data33333", data);
            setPayments(data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        } finally {
            setLoading(false);
        }
    }, [periodsId, auth, toast]);

    const [showModalGenerar, setShowModalGenerar] = useState(false);
    const [showModalIps, setShowModalIps] = useState(false);
    const [showModalBonificacion, setShowModalBonificacion] = useState(false);
    const [showModalCierre, setShowModalCierre] = useState(false);
    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        fetchPayrolls()
    }, [fetchPayrolls]);

    return (
        <Box bg={'white'} width={{ base: "98%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }}>
            <GenerarModalConfirm
                isOpen={showModalGenerar}
                onClose={() => setShowModalGenerar(false)}
                onConfirm={() => {
                    setShowModalGenerar(false);
                    createPayment();
                }}
            />
            <IpsModalConfirm
                isOpen={showModalIps}
                onClose={() => setShowModalIps(false)}
                onConfirm={() => {
                    setShowModalIps(false);
                    handleIps();
                }}
            />
            <CierreModalConfirm
                isOpen={showModalCierre}
                onClose={() => setShowModalCierre(false)}
                onConfirm={() => {
                    setShowModalCierre(false);
                    handleClosePayroll();
                }}
                detailsWhiteoutVerified={payments?.DetailsWithoutVerification || 0}
            />
            <BonificacionModalConfirm
                isOpen={showModalBonificacion}
                onClose={() => setShowModalBonificacion(false)}
                onConfirm={() => {
                    setShowModalBonificacion(false);
                    handleBonification();
                }}
            />
            <Button m={2} onClick={handleBack} background='gray.100'><IoMdArrowRoundBack /></Button>

            <Box mb={6} display={"flex"} justifyContent={"end"} gap={4} >

                <Flex gap={2}>

                    {payments?.payrollDetails ?
                        payments?.payrollDetails?.length > 0 && (
                            <Button
                                fontSize={13}
                                borderRadius='full'
                                textColor={'white'}
                                background='pink.500'
                                isDisabled={payments?.isEnded || loading}
                                onClick={() => setShowModalCierre(true)}
                            >
                                Cierre
                            </Button>
                        ) : (
                            <>
                            </>
                        )}
                    <Button
                        fontSize={13}
                        borderRadius='full'
                        textColor={'white'}
                        background='pink.400'
                        isDisabled={payments?.isEnded || loading}
                        onClick={() => setShowModalGenerar(true)}
                    >
                        Generar Salario
                    </Button>
                    <Button
                        fontSize={13}
                        borderRadius='full'
                        background='pink.100'
                        isDisabled={payments?.isEnded || loading}
                        onClick={() => setShowModalBonificacion(true)}
                    >
                        Generar Bonificaciones
                    </Button>
                    <Button
                        fontSize={13}
                        borderRadius='full'
                        background='pink.100'
                        isDisabled={payments?.isEnded || loading}
                        onClick={() => setShowModalIps(true)}
                    >
                        Generar IPS
                    </Button>
                </Flex>
            </Box>

            <Box display={"flex"} justifyContent={"center"} >
                <TableSalaries payments={payments?.payrollDetails || []} />
            </Box>
        </Box>
    );
};

export default ListEmployeePage;
