'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { TableEmployee } from '@/components/lists/TableEmployee';
import { getEmployees } from '@/utils/employee.http';
import { Box, Button, useToast } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { getPayrollDetails, createPayments, calculateIpsForAllEmployees, calculateBonificationForAllEmployees } from '@/utils/salary.http';
import Period from '@/types/period';
import { TableSalaries } from '@/components/general/salaries/List';
import PayrollDetail from '@/types/period';
import GenericModalConfirm from '@/components/general/salaries/Prueba';
import { set } from 'zod';
import IpsModalConfirm from '@/components/general/salaries/BonificacionModal';
import CierreModalConfirm from '@/components/general/salaries/CierreModal';
import BonificacionModalConfirm from '@/components/general/salaries/BonificacionModal';
import GenerarModalConfirm from '@/components/general/salaries/GenerarModal';

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
    const toast = useToast();
    const { periodsId } = useParams();
    const auth = useAuth();
    const [payments, setPayments] = useState<Period[]>([]);



    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);


    const columnMapping = {
        'Nombre': 'name',
        'CI/RUC': 'ciRuc',
        'Correo Electrónico': 'email',
    };

    const createPayment = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await createPayments(periodsId as string, token);
            console.log("dataaaaa", data);
            fetchPayrolls();
        }

        catch (error) {
            console.error('Error al generar salario:', error);
            toast({
                title: "Error",
                description: "Error al generar el salario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }
    const handleIps = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await calculateIpsForAllEmployees(periodsId as string, token);
            console.log(data);
        }
        catch (error) {
            console.error('Error al calcular IPS:', error);
            toast({
                title: "Error",
                description: "Error al calcular IPS",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }
    const handleBonification = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await calculateBonificationForAllEmployees(periodsId as string, token);
            console.log(data);
        }
        catch (error) {
            console.error('Error al calcular bonificaciones:', error);
            toast({
                title: "Error",
                description: "Error al calcular bonificaciones",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }



    const fetchPayrolls = useCallback(async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await getPayrollDetails(periodsId as string, token);
            console.log("data22222", data);
            setPayments(data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        }
    }, [periodsId, auth]);

    const [showModalGenerar, setShowModalGenerar] = useState(false);
    const [showModalIps, setShowModalIps] = useState(false);
    const [showModalBonificacion, setShowModalBonificacion] = useState(false);
    const [showModalCierre, setShowModalCierre] = useState(false);


    useEffect(() => {
        fetchPayrolls()
    }, [fetchPayrolls]);

    return (
        <>
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
                }}
            />
            <CierreModalConfirm
                isOpen={showModalCierre}
                onClose={() => setShowModalCierre(false)}
                onConfirm={() => {
                    setShowModalCierre(false);
                }}
            />
            <BonificacionModalConfirm
                isOpen={showModalBonificacion}
                onClose={() => setShowModalBonificacion(false)}
                onConfirm={() => {
                    setShowModalBonificacion(false);
                }}
            />

            <Button onClick={() => setShowModalGenerar(true)}>
                Generar Salario
            </Button>
            <Button onClick={() => setShowModalIps(true)}>
                Generar IPS
            </Button>
            <Button onClick={() => setShowModalBonificacion(true)}>
                Generar Bonificaciones
            </Button>
            <Button onClick={() => setShowModalCierre(true)}>
                Cierre
            </Button>


            <TableSalaries payments={payments.payrollDetails} />

        </>
    );
};

export default ListEmployeePage;
