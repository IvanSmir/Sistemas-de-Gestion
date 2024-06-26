'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { TableEmployee } from '@/components/lists/TableEmployee';
import { getEmployees } from '@/utils/employee.http';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
    const { id } = useParams();
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const [employeeData, setEmployeeData] = useState<Root[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isSalary, setIsSalary] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEmployees(1);

                const datafinal = data.data as Root[];

                setTotal(data.totalPages);
                setEmployeeData(transformData(datafinal));
                console.log(data);
                setLoading(false);

            } catch (error) {
                console.error('Error al obtener los empleados:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columnMapping = {
        'Nombre': 'name',
        'CI/RUC': 'ciRuc',
        'Correo Electrónico': 'email'
    };

    return (
        <>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <TableEmployee data={employeeData} columnMapping={columnMapping} setEmployeeData={setEmployeeData} total={total} isSalary={isSalary} />
            )}
        </>
    );
};

export default ListEmployeePage;
