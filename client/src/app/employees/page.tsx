import { DataTable } from '@/components/lists/Table';
import React from 'react';

const ListEmployeePage = () => {
    const data = [
        { id: '1', name: 'Alice', age: 24, email: 'alice@example.com' },
        { id: '2', name: 'Bob', age: 30, email: 'bob@example.com' },
        { id: '3', name: 'Carol', age: 29, email: 'carol@example.com' }
    ];
    const columnMapping = {
        'Nombre': 'name',
        'Edad': 'age',
        'Correo Electrónico': 'email'
    };
    return (
        <>
            <DataTable data={data} columnMapping={columnMapping} />
        </>
    )

}
export default ListEmployeePage;