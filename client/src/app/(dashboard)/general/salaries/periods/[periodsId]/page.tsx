'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { TableEmployee } from '@/components/lists/TableEmployee';
import { getEmployees } from '@/utils/employee.http';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { getPayrollDetails } from '@/utils/salary.http';
import Period from '@/types/period';

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
    const [periods, setPeriods] = useState<Period[]>([]);

    const [employeeData, setEmployeeData] = useState<Root[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isSalary, setIsSalary] = useState(true);


    const columnMapping = {
        'Nombre': 'name',
        'CI/RUC': 'ciRuc',
        'Correo Electrónico': 'email',
    };


    const fetchPayrolls = useCallback(async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await getPayrollDetails(periodsId as string, token);
            console.log(data);
            setPeriods(data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        }
    }, [periodsId, auth]);


    useEffect(() => {
        fetchPayrolls()
    }, [fetchPayrolls]);

    return (
        <div className='w-[70vw]'>

        </div>
    );
};

export default ListEmployeePage;
