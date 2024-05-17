'use client'
import { DataTable } from '@/components/lists/Table';
import { TableEmployee } from '@/components/lists/TableEmployee';
import { TablePerson } from '@/components/lists/TablePerson';
import { getEmployees } from '@/utils/employee.http';
import React, { useEffect, useState } from 'react';
interface Root {
    id: string
    enterDate: string
    person: Person
}

interface Person {
    ciRuc: string
    name: string
    email: string
    phone: string
    address: string
    birthDate: string
}

const transformedDate = (fecha: string) => {
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
const transformData = (data: Root[]) => {
    return data.map(datum => ({
        ...datum, person: { age: transformedDate(datum.person.birthDate), ...datum.person }
    }));
};

const ListEmployeePage = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEmployees();
                setEmployeeData(transformData(data.data));
                console.log(data)
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
        'Fecha de Nacimiento': 'age',
        'Correo Electrónico': 'email'
    };

    return (
        <>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <TableEmployee data={employeeData} columnMapping={columnMapping} />
            )}
        </>
    );
};

export default ListEmployeePage;
